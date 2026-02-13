
import { insforge } from '../../lib/insforge';

export interface Task {
  id: string;
  project_id: string;
  parent_id?: string;
  title: string;
  description?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  agent_type: string;
  depth: number;
  created_at: string;
}

export const DagService = {
  /**
   * Récupère l'arborescence complète d'un projet
   */
  async getProjectTasks(projectId: string): Promise<Task[]> {
    const { data, error } = await insforge.database
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (error) throw new Error(error.message);
    return data as Task[];
  },

  /**
   * Crée une nouvelle tâche ou sous-tâche
   */
  async createTask(taskData: Partial<Task> & { project_id: string; title: string }) {
    const { data, error } = await insforge.database
      .from('tasks')
      .insert([taskData])
      .select()
      .single();

    if (error) throw new Error(error.message);

    return data;
  },

  /**
   * Met à jour le statut d'une tâche
   */
  async updateTaskStatus(taskId: string, status: Task['status']) {
    const { data, error } = await insforge.database
      .from('tasks')
      .update({ status })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Récupère les dépendances d'une tâche
   */
  async getTaskDependencies(taskId: string) {
    const { data, error } = await insforge.database
      .from('task_dependencies')
      .select('depends_on_task_id')
      .eq('task_id', taskId);

    if (error) throw new Error(error.message);
    return data.map((d: any) => d.depends_on_task_id);
  }
};
