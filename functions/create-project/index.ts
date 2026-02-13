
import { createClient } from 'npm:@insforge/sdk';
import { TemplateService } from '../../src/server/services/template-service'; // Assumes shared code or copy

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
    const { name, description, templateId } = await req.json();
    const authHeader = req.headers.get('Authorization');
    const userToken = authHeader?.replace('Bearer ', '') || null;

    if (!userToken) {
        throw new Error("Missing Authorization Header");
    }

    const client = createClient({
      baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
      edgeFunctionToken: userToken
    });

    // 1. Get User ID from Token (via Auth API)
    const { data: sessionData, error: sessionError } = await client.auth.getCurrentSession();
    if (sessionError || !sessionData?.session?.user) {
        throw new Error("Unauthorized: Invalid Session");
    }
    const userId = sessionData.session.user.id;

    // 2. Create Project
    const { error: createError } = await client.database
        .from('projects')
        .insert([{
            name: name,
            owner_id: userId,
        }]);

    // Mock return - in real DB this returns the created object
    const project = { id: 'mock-proj-id', name, owner_id: userId };

    if (createError) throw createError;

    // 3. Apply Template if requested
    // Note: TemplateService needs to be compatible with Deno/Edge or logic inlined here
    // For now, we return success and client/another call handles template

    return new Response(JSON.stringify({ success: true, project }), {
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
