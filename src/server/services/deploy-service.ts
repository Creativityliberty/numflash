
import { insforge } from '../../lib/insforge';

export const DeployService = {
  /**
   * Lance le déploiement de l'application sur le réseau InsForge
   */
  async deployApp(projectId: string, region: 'us-east' | 'eu-central' = 'us-east') {
    // 1. Invoquer la fonction de build/déploiement
    const { data, error } = await insforge.functions.invoke('create-deployment', {
      body: {
        projectId,
        region,
        instanceType: 'nano'
      }
    });

    if (error) throw new Error(`Échec du déploiement : ${error.message}`);

    // 2. Notifier en temps réel le succès
    await insforge.realtime.publish(`project:${projectId}`, 'deployed', {
      url: `https://${projectId}.${region}.insforge.app`,
      status: 'active'
    });

    return data;
  }
};
