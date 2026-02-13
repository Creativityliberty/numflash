
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
    const { projectId, prompt, modelId = 'gemini-3-pro-preview' } = await req.json();
    const authHeader = req.headers.get('Authorization');
    const userToken = authHeader?.replace('Bearer ', '') || null;

    if (!userToken) {
        throw new Error("Missing Authorization Header");
    }

    // 1. Initialiser le client InsForge avec le token utilisateur (RLS)
    const client = createClient({
      baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
      edgeFunctionToken: userToken
    });

    // 2. Vérifier l'accès au projet
    const { data: project, error: projectError } = await client.database
      .from('projects')
      .select('id, owner_id')
      .eq('id', projectId)
      .single();

    if (projectError || !project) {
        throw new Error("Project not found or access denied.");
    }

    // 3. Appeler le modèle AI pour planifier
    // Note: Utilisation de l'AI Gateway via le SDK
    const completion = await client.ai.chat.completions.create({
      model: modelId,
      messages: [
        {
          role: 'system',
          content: 'Tu es l\'architecte de Nümflash. Réponds uniquement avec un JSON représentant une liste de tâches pour un projet de développement. Format: { tasks: [{ title, description }] }'
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    });

    let plan;
    try {
        plan = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
        throw new Error("Failed to parse AI response: " + completion.choices[0].message.content);
    }

    // 4. Insérer les tâches générées
    const tasksToInsert = plan.tasks.map((t: any) => ({
        project_id: projectId,
        title: t.title,
        description: t.description,
        agent_type: 'worker',
        status: 'pending'
    }));

    const { error: insertError } = await client.database
      .from('tasks')
      .insert(tasksToInsert);

    // Mock return because .select() is not on our minimal mock type
    const insertedTasks = tasksToInsert;

    if (insertError) throw insertError;

    // 5. Notifier via Realtime (facultatif si le client écoute déjà)
    await client.realtime.publish(`project:${projectId}`, 'workflow_created', { tasks: insertedTasks });

    return new Response(JSON.stringify({ success: true, tasks: insertedTasks }), {
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
