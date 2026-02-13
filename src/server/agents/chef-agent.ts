
import { insforge } from '../../lib/insforge';

export const ChefAgent = {
  /**
   * Planifie le projet en créant les tâches initiales dans la DB
   */
  async createWorkflow(projectId: string, userPrompt: string, modelId: string = 'gemini-3-pro-preview') {
    // Use the Serverless Function instead of direct client-side AI call
    const { data, error } = await insforge.functions.invoke('agent-chef', {
        body: {
            projectId,
            prompt: userPrompt,
            modelId
        }
    });

    if (error) throw new Error(`Agent Chef Error: ${error.message}`);
    return data.tasks;
  }
};
