
import { PROJECT_TEMPLATES } from '../../data/templates';
import { FileService } from './file-service';
import { insforge } from '../../lib/insforge';

export const TemplateService = {
    /**
     * Initialize a project with a selected template
     */
    async applyTemplate(projectId: string, templateId: string) {
        const template = PROJECT_TEMPLATES.find(t => t.id === templateId);
        if (!template) {
            throw new Error(`Template ${templateId} not found`);
        }

        // Apply files sequentially (could be parallelized)
        for (const file of template.files) {
            await FileService.saveGeneratedCode(projectId, file.path, file.content);
        }

        // Log/Notify
        await insforge.realtime.publish(`project:${projectId}`, 'template_applied', {
            templateId,
            fileCount: template.files.length
        });

        return template;
    }
};
