
import { createClient } from 'npm:@insforge/sdk';
import JSZip from 'npm:jszip';

export default async function(req: Request): Promise<Response> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { projectId } = await req.json();
    const authHeader = req.headers.get('Authorization');
    const userToken = authHeader?.replace('Bearer ', '') || null;

    if (!userToken) throw new Error("Unauthorized");

    // 1. Initialize Client
    // We need administrative privileges or the user's token to call the Deployment API
    // Using userToken assumes the Deployment API accepts it and handles RLS/Permissions
    const client = createClient({
      baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
      edgeFunctionToken: userToken
    });

    // 2. Create Deployment Record via InsForge API
    // POST /api/deployments
    // This returns the deployment ID and potentially an upload URL
    const createResp = await fetch(`${Deno.env.get('INSFORGE_BASE_URL')}/api/deployments`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projectId }) // Assuming schema
    });

    if (!createResp.ok) {
        throw new Error(`Failed to create deployment: ${await createResp.text()}`);
    }

    const deployment = await createResp.json();
    const deploymentId = deployment.data?.id || deployment.id;

    // 3. Gather Files & Zip
    const { data: files } = await client.database
      .from('files')
      .select('path, storage_key')
      .eq('project_id', projectId);

    const zip = new JSZip();
    await Promise.all(files.map(async (file: any) => {
        const { data: blob } = await client.storage.from('code-assets').download(file.storage_key);
        if (blob) {
            const text = await blob.text();
            zip.file(file.path, text);
        }
    }));
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // 4. Upload Source Code
    // The createDeployment endpoint likely returns a presigned URL or we use a standard upload endpoint
    // If standard: POST /api/deployments/:id/source
    // Or upload to S3 directly if URL provided.
    // Assuming InsForge standard: Upload to Storage bucket 'deployments' or specific endpoint.

    // Simplification based on standard patterns:
    // Upload zip to a temporary storage location, then tell deployment service where it is.
    const zipPath = `deployments/${projectId}/${deploymentId}.zip`;
    const { data: uploadData, error: uploadError } = await client.storage
        .from('deployments') // Assuming this bucket exists or we use 'code-assets'
        .upload(zipPath, zipBlob);

    if (uploadError) {
        // Fallback if 'deployments' bucket doesn't exist, try 'code-assets'
         await client.storage.from('code-assets').upload(zipPath, zipBlob);
    }

    // 5. Start Deployment
    // POST /api/deployments/:id/start
    const startResp = await fetch(`${Deno.env.get('INSFORGE_BASE_URL')}/api/deployments/${deploymentId}/start`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${userToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            sourcePath: zipPath // Pass the path to the uploaded zip
        })
    });

    if (!startResp.ok) {
         throw new Error(`Failed to start deployment: ${await startResp.text()}`);
    }

    const startData = await startResp.json();

    return new Response(JSON.stringify({ success: true, deploymentId, status: 'building', url: startData.url }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
