
import { createClient } from 'npm:@insforge/sdk';

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
    const { name, description } = await req.json();
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

    // Mock return
    const project = { id: 'mock-proj-id', name, owner_id: userId };

    if (createError) throw createError;

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
