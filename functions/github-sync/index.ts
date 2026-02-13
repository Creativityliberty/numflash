
import { createClient } from 'npm:@insforge/sdk';
import { Octokit } from 'npm:@octokit/rest';

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
    const { projectId, branch, message, repo } = await req.json();
    const authHeader = req.headers.get('Authorization');
    const userToken = authHeader?.replace('Bearer ', '') || null;

    if (!userToken) {
        throw new Error("Missing Authorization Header");
    }

    // 1. Initialiser le client InsForge avec le token utilisateur
    const client = createClient({
      baseUrl: Deno.env.get('INSFORGE_BASE_URL'),
      edgeFunctionToken: userToken
    });

    // 2. Récupérer la liste des fichiers du projet en DB
    const { data: files, error: dbError } = await client.database
      .from('files')
      .select('path, storage_key')
      .eq('project_id', projectId);

    if (dbError) throw dbError;

    // 3. Logique GitHub (Octokit)
    // Le token GitHub doit être stocké en secure env ou passé par le client (moins secure)
    // Ici on suppose qu'il est dans les secrets d'environnement de la fonction
    const octokit = new Octokit({ auth: Deno.env.get('GITHUB_ACCESS_TOKEN') });

    // Récupérer le SHA du dernier commit de la branche
    const { data: refData } = await octokit.git.getRef({
        owner: repo.owner,
        repo: repo.name,
        ref: `heads/${branch}`
    });

    const latestCommitSha = refData.object.sha;

    // Créer les blobs et l'arbre
    const treeItems = [];
    for (const file of files) {
        // Télécharger le contenu du fichier depuis le Storage
        const { data: blob } = await client.storage.from('code-assets').download(file.storage_key);
        const content = await blob?.text();

        if (content) {
            treeItems.push({
                path: file.path,
                mode: '100644',
                type: 'blob',
                content: content
            });
        }
    }

    // Créer le tree
    const { data: treeData } = await octokit.git.createTree({
        owner: repo.owner,
        repo: repo.name,
        base_tree: latestCommitSha,
        tree: treeItems
    });

    // Créer le commit
    const { data: commitData } = await octokit.git.createCommit({
        owner: repo.owner,
        repo: repo.name,
        message: message || "Update from Nümflash",
        tree: treeData.sha,
        parents: [latestCommitSha]
    });

    // Mettre à jour la ref
    await octokit.git.updateRef({
        owner: repo.owner,
        repo: repo.name,
        ref: `heads/${branch}`,
        sha: commitData.sha
    });

    return new Response(JSON.stringify({ success: true, sha: commitData.sha }), {
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
