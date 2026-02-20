
import { insforge } from '../../lib/insforge';
import { PROJECT_TEMPLATES } from '../../data/templates';
import { DagService } from './dag-service';
import { FileService } from './file-service';

export const TemplateService = {
  /**
   * Apply a PocketFlow template to a project
   * 1. Create a root task for the template
   * 2. Upload all template files to storage/db
   */
  async applyTemplate(projectId: string, templateId: string) {
    const template = PROJECT_TEMPLATES.find(t => t.id === templateId);
    if (!template) throw new Error(`Template ${templateId} not found`);

    // 1. Create Root Task
    const rootTask = await DagService.createTask({
        project_id: projectId,
        title: `Initialize ${template.name}`,
        description: `Setup based on template: ${template.description}`,
        status: 'running',
        agent_type: 'architect',
        depth: 0
    });

    // 2. Upload Files
    for (const file of template.files) {
        await FileService.saveGeneratedCode(projectId, file.path, file.content);
    }

    // 3. Complete Task
    await DagService.updateTaskStatus(rootTask.id, 'completed');

    // 4. Notify (Optional, as RealtimeHub handles DB events)
    return { success: true };
  }
};
