
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
    const { projectId, task, modelId = 'gemini-3-pro-preview' } = await req.json();
    const authHeader = req.headers.get('Authorization');
    const userToken = authHeader?.replace('Bearer ', '') || null;

    if (!userToken) {
        throw new Error("Missing Authorization Header");
    }

    const client = createClient({
      baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
      edgeFunctionToken: userToken
    });

    // 1. Vérifier l'accès au projet et à la tâche
    // (RLS gère l'accès aux données, mais on valide l'existence)
    const { data: taskRecord, error: taskError } = await client.database
       .from('tasks')
       .select('id, title, description')
       .eq('id', task.id)
       .eq('project_id', projectId)
       .single();

    if (taskError || !taskRecord) throw new Error("Task access denied");

    // 2. Générer le code
    const completion = await client.ai.chat.completions.create({
      model: modelId,
      messages: [
        { role: 'system', content: 'Tu es un expert React. Écris uniquement le code sans explications.' },
        { role: 'user', content: `Implémente la tâche suivante : ${taskRecord.title}. ${taskRecord.description}` }
      ],
      // Pour une fonction non-streaming simple (ou streaming via Response body si supporté)
      stream: false
    });

    const generatedCode = completion.choices[0].message.content;
    const fileName = `${taskRecord.title.replace(/\s+/g, '-').toLowerCase()}.tsx`;
    const path = `src/components/${fileName}`;

    // 3. Sauvegarder le fichier (Storage + DB)
    // Upload Blob
    const fileBlob = new Blob([generatedCode], { type: 'text/plain' });
    const { data: storageData, error: storageError } = await client.storage
        .from('code-assets')
        .upload(path, fileBlob); // Note: In Deno env, Blob/File might need polyfill or string content directly if supported

    if (storageError) throw storageError;

    // Insert DB Reference
    const { error: dbError } = await client.database
        .from('files')
        .insert([{
            project_id: projectId,
            path: path,
            storage_key: storageData.key,
            storage_url: storageData.url
        }]);

    if (dbError) throw dbError;

    // 4. Update Task Status
    await client.database
        .from('tasks')
        .update({ status: 'completed' })
        .eq('id', task.id);

    // 5. Notify Realtime
    await client.realtime.publish(`project:${projectId}`, 'file_created', { path, fileName });
    await client.realtime.publish(`project:${projectId}`, 'task_updated', { id: task.id, status: 'completed' });

    return new Response(JSON.stringify({ success: true, path, content: generatedCode }), {
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
