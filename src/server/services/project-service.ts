
import { insforge } from '../../lib/insforge';

export interface Project {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

export const ProjectService = {
  /**
   * List all projects for the current user
   */
  async listProjects(): Promise<Project[]> {
    const { data, error } = await insforge.database
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data as Project[];
  },

  /**
   * Create a new project
   */
  async createProject(name: string): Promise<Project> {
      // Get current user ID
      const { data: { user } } = await insforge.auth.getCurrentUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await insforge.database
        .from('projects')
        .insert([{
            name,
            owner_id: user.id
        }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Project;
  },

  /**
   * Delete a project
   */
  async deleteProject(projectId: string) {
      const { error } = await insforge.database
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw new Error(error.message);
  }
};
