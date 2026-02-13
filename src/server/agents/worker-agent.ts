
import { insforge } from '../../lib/insforge';
import { FileService } from '../services/file-service';

export const WorkerAgent = {
  /**
   * Génère le code d'un composant et le sauvegarde
   */
  async executeCodingTask(projectId: string, task: any, modelId: string = 'gemini-3-pro-preview', onChunk?: (text: string) => void) {
    // Use the Serverless Function. Note: Streaming is not supported in simple invoke(), so we await full result.
    // If streaming is critical, we would use a different pattern (e.g. Realtime channel for chunks).

    if (onChunk) onChunk("// Generating code via Agent Worker...");

    const { data, error } = await insforge.functions.invoke('agent-worker', {
        body: {
            projectId,
            task,
            modelId
        }
    });

    if (error) throw new Error(`Agent Worker Error: ${error.message}`);

    if (onChunk) onChunk(data.content);
  }
};
