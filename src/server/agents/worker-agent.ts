
import { insforge } from '../../lib/insforge';
import { FileService } from '../services/file-service';

export const WorkerAgent = {
  /**
   * Génère le code d'un composant et le sauvegarde
   */
  async executeCodingTask(projectId: string, task: any, modelId: string = 'gemini-3-pro-preview', onChunk?: (text: string) => void) {
    let fullCode = "";

    // 1. Streaming de la génération de code
    const stream = await insforge.ai.chat.completions.create({
      model: modelId,
      messages: [
        { role: 'system', content: 'Tu es un expert React. Écris uniquement le code sans explications.' },
        { role: 'user', content: `Implémente la tâche suivante : ${task.title}. ${task.description}` }
      ],
      stream: true
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        fullCode += delta;
        if (onChunk) onChunk(delta);
      }
    }

    // 2. Une fois fini, on persiste le fichier
    const fileName = `${task.title.replace(/\s+/g, '-').toLowerCase()}.tsx`;
    const path = `src/components/${fileName}`;
    await FileService.saveGeneratedCode(projectId, path, fullCode);

    // 3. Mettre à jour le statut de la tâche en DB
    await insforge.database
      .from('tasks')
      .update({ status: 'completed' })
      .eq('id', task.id);

    // 4. Notifier
    await insforge.realtime.publish(`project:${projectId}`, 'file_created', { path, fileName });
  }
};
