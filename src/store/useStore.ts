
import { create } from 'zustand';
import { insforge } from '../lib/insforge';

interface Project {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

interface Task {
  id: string;
  project_id: string;
  parent_id?: string;
  title: string;
  description?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  agent_type: string;
  depth: number;
}

interface FileNode {
  id: string;
  project_id: string;
  path: string;
  storage_key: string;
  storage_url: string;
  content?: string; // Loaded on demand
}

interface AppState {
  currentProject: Project | null;
  tasks: Task[];
  files: FileNode[];
  isConnected: boolean;
  messages: any[]; // Chat history

  // Actions
  setProject: (project: Project) => void;
  setTasks: (tasks: Task[]) => void;
  updateTask: (taskId: string, status: Task['status']) => void;
  addFile: (file: FileNode) => void;
  setFiles: (files: FileNode[]) => void;
  setConnected: (status: boolean) => void;
  addMessage: (msg: any) => void;

  // Async Actions
  fetchProjectData: (projectId: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  currentProject: null,
  tasks: [],
  files: [],
  isConnected: false,
  messages: [],

  setProject: (project) => set({ currentProject: project }),
  setTasks: (tasks) => set({ tasks }),
  updateTask: (taskId, status) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, status } : t)
  })),
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  setFiles: (files) => set({ files }),
  setConnected: (status) => set({ isConnected: status }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

  fetchProjectData: async (projectId) => {
    // 1. Fetch Tasks
    const { data: tasks, error: taskError } = await insforge.database
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: true });

    if (tasks) set({ tasks: tasks as Task[] });
    if (taskError) console.error("Error fetching tasks:", taskError);

    // 2. Fetch Files
    const { data: files, error: fileError } = await insforge.database
      .from('files')
      .select('*')
      .eq('project_id', projectId);

    if (files) set({ files: files as FileNode[] });
    if (fileError) console.error("Error fetching files:", fileError);
  }
}));
