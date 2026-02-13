
import { insforge } from '../../lib/insforge';

export const DeployService = {
  /**
   * Starts the deployment process for a project
   * 1. Create Deployment Record
   * 2. Generate ZIP & Upload (Handled by the server-side function)
   * 3. Trigger Build
   */
  async deployProject(projectId: string) {
    // We call a server-side function that handles the secure orchestration
    // with the internal Deployment API
    const { data, error } = await insforge.functions.invoke('deploy-project', {
      body: {
        projectId
      }
    });

    if (error) throw new Error(`Deployment Failed: ${error.message}`);
    return data;
  },

  /**
   * Get deployment status
   */
  async getDeploymentStatus(deploymentId: string) {
      // Direct API call if accessible, or via function proxy if RLS restricts it
      // Assuming public metadata availability or user ownership
      return await insforge.database
        .from('deployments') // Assuming table exists in schema, otherwise need API call
        .select('*')
        .eq('id', deploymentId)
        .single();
  }
};
