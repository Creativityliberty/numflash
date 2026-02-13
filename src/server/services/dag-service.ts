
import { insforge } from '../../lib/insforge';

export const DagService = {
  /**
   * Récupère l'arborescence complète d'un projet
   */
  async getProjectTasks(projectId: string) {
    // RLS will automatically filter, but we explicitly filter by project_id
    const { data, error } = await insforge.database
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Crée une nouvelle tâche ou sous-tâche
   */
  async createTask(taskData: { project_id: string; title: string; parent_id?: string; depth: number }) {
    const { error } = await insforge.database
      .from('tasks')
      .insert([taskData]);

    if (error) throw new Error(error.message);

    // Simulation de retour
    return { ...taskData, id: 'mock-id' };
  }
};
