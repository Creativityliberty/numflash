
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

    const client = createClient({
      baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
      edgeFunctionToken: userToken
    });

    // Récupérer les fichiers
    const { data: files } = await client.database
      .from('files')
      .select('path, storage_key')
      .eq('project_id', projectId);

    const zip = new JSZip();

    // Ajouter chaque fichier au ZIP
    await Promise.all(files.map(async (file: any) => {
        const { data: blob } = await client.storage.from('code-assets').download(file.storage_key);
        if (blob) {
            const text = await blob.text();
            zip.file(file.path, text);
        }
    }));

    const content = await zip.generateAsync({ type: "uint8array" });

    return new Response(content, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="project-${projectId}.zip"`
      }
    });

  } catch (error: any) {
     return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
