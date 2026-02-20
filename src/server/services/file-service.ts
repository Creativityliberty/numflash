
import { insforge } from '../../lib/insforge';

export const FileService = {
  /**
   * Sauvegarde le code généré par un agent dans le storage et référence le fichier en DB
   */
  async saveGeneratedCode(projectId: string, path: string, content: string) {
    // 1. Convertir le texte en Blob (format requis par le SDK)
    const fileBlob = new Blob([content], { type: 'text/plain' });

    // 2. Upload dans le bucket 'code-assets'
    // Use project ID to namespace files in storage
    const storagePath = `${projectId}/${path}`;
    const { data: storageData, error: storageError } = await insforge.storage
      .from('code-assets')
      .upload(storagePath, fileBlob, { upsert: true });

    if (storageError) throw new Error(`Erreur Storage: ${storageError.message}`);

    // 3. Enregistrer les métadonnées dans la table 'files' pour le Tree View
    const { data: fileRecord, error: dbError } = await insforge.database
      .from('files')
      .upsert([{
        project_id: projectId,
        path: path,
        storage_key: storageData.key,
        storage_url: storageData.url
      }], { onConflict: 'project_id, path' })
      .select()
      .single();

    if (dbError) throw new Error(`Erreur Database: ${dbError.message}`);

    // 4. Notify Realtime
    await insforge.realtime.publish(`project:${projectId}`, 'file_created', fileRecord);

    return storageData;
  },

  async getFileContent(storageKey: string) {
      const { data, error } = await insforge.storage
        .from('code-assets')
        .download(storageKey);

      if (error) throw new Error(error.message);
      if (!data) return "";

      return await data.text();
  },

  async getProjectFiles(projectId: string) {
      const { data, error } = await insforge.database
        .from('files')
        .select('*')
        .eq('project_id', projectId);

      if (error) throw new Error(error.message);
      return data;
  }
};
