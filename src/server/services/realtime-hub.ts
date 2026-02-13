
import { insforge } from '../../lib/insforge';

export const RealtimeHub = {
  /**
   * Connexion au canal du projet
   */
  async subscribeToProject(projectId: string, onUpdate: (payload: any) => void) {
    await insforge.realtime.connect();

    const channel = `project:${projectId}`;
    const response = await insforge.realtime.subscribe(channel);

    if (response.ok) {
      insforge.realtime.on('task_updated', (payload) => {
        onUpdate(payload);
      });
      insforge.realtime.on('workflow_created', (payload) => {
          onUpdate({ type: 'workflow_created', ...payload });
      });
      insforge.realtime.on('file_created', (payload) => {
          onUpdate({ type: 'file_created', ...payload });
      })
    }
  },

  /**
   * Notifie tous les clients d'un changement d'état
   */
  async notifyTaskChange(projectId: string, taskStatus: any) {
    await insforge.realtime.publish(`project:${projectId}`, 'task_updated', taskStatus);
  }
};
