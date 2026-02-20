
import React, { useEffect, useState } from 'react';
import { ProjectService, Project } from '../server/services/project-service';
import { useStore } from '../store/useStore';
import { Plus, Folder, Trash2, Loader2, ArrowRight } from 'lucide-react';
import { useToast } from '../components/Toast';
import clsx from 'clsx';

const ProjectListView = () => {
    const { setProject, setConnected, fetchProjectData } = useStore();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newProjectName, setNewProjectName] = useState("");
    const { showToast } = useToast();

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const data = await ProjectService.listProjects();
            setProjects(data);
        } catch (e: any) {
            showToast(`Failed to load projects: ${e.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newProjectName.trim()) return;

        try {
            setIsCreating(true);
            const project = await ProjectService.createProject(newProjectName);
            showToast("Project created successfully", "success");
            setProjects([project, ...projects]);
            setNewProjectName("");
            handleSelectProject(project);
        } catch (e: any) {
            showToast(`Failed to create project: ${e.message}`, 'error');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteProject = async (e: React.MouseEvent, projectId: string) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this project?")) return;

        try {
            await ProjectService.deleteProject(projectId);
            setProjects(projects.filter(p => p.id !== projectId));
            showToast("Project deleted", "info");
        } catch (e: any) {
            showToast(`Failed to delete: ${e.message}`, 'error');
        }
    };

    const handleSelectProject = async (project: Project) => {
        setProject(project);
        setConnected(true); // Assuming WebSocket connects here or in App.tsx effect
        try {
            await fetchProjectData(project.id);
            // App.tsx handles the view switch via state
        } catch (e: any) {
             showToast(`Error loading project data: ${e.message}`, 'error');
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-8 h-full flex flex-col">
            <header className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">My Projects</h2>
                <p className="text-slate-500 dark:text-slate-400">Manage your AI-powered applications.</p>
            </header>

            {/* Create Section */}
            <div className="mb-8 p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <form onSubmit={handleCreateProject} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">New Project Name</label>
                        <input
                            type="text"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            placeholder="e.g. CRM Dashboard, Portfolio..."
                            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isCreating || !newProjectName.trim()}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 transition-all disabled:opacity-50 h-[50px]"
                    >
                        {isCreating ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                        Create
                    </button>
                </form>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-4">
                {projects.map(project => (
                    <div
                        key={project.id}
                        onClick={() => handleSelectProject(project)}
                        className="group relative p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between h-[200px]"
                    >
                        <div>
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Folder size={24} />
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 dark:text-white truncate">{project.name}</h3>
                            <p className="text-xs text-slate-500 mt-1 font-mono">{project.id.split('-')[0]}...</p>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                             <span className="text-xs text-slate-400">
                                {new Date(project.created_at).toLocaleDateString()}
                             </span>
                             <div className="flex gap-2">
                                <button
                                    onClick={(e) => handleDeleteProject(e, project.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <button className="p-2 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowRight size={16} />
                                </button>
                             </div>
                        </div>
                    </div>
                ))}

                {projects.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400">
                        <p>No projects yet. Create one to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectListView;
