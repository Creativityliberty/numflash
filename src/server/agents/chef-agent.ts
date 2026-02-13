
import { insforge } from '../../lib/insforge';

export const ChefAgent = {
  /**
   * Planifie le projet en créant les tâches initiales dans la DB
   */
  async createWorkflow(projectId: string, userPrompt: string) {
    // 1. Demander à l'IA de structurer le plan
    const completion = await insforge.ai.chat.completions.create({
      model: 'anthropic/claude-3.5-haiku',
      messages: [
        {
          role: 'system',
          content: 'Tu es l\'architecte de Nümflash. Réponds uniquement avec un JSON représentant une liste de tâches pour un projet de développement. Format: { tasks: [{ title, description }] }'
        },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' }
    });

    let plan;
    try {
        plan = JSON.parse(completion.choices[0].message.content);
    } catch (e) {
        console.error("Failed to parse AI response", e);
        return [];
    }

    // 2. Insérer les tâches dans la base de données InsForge
    const { error } = await insforge.database
      .from('tasks')
      .insert(plan.tasks.map((t: any) => ({
        project_id: projectId,
        title: t.title,
        description: t.description,
        agent_type: 'worker',
        status: 'pending'
      })));

    const tasks = plan.tasks;

    if (error) throw new Error(`Erreur lors de la création des tâches: ${error.message}`);

    // 3. Notifier le frontend via Realtime
    await insforge.realtime.publish(`project:${projectId}`, 'workflow_created', { tasks });

    return tasks;
  }
};
