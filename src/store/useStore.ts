
import { create } from 'zustand';
import { insforge } from '../lib/insforge';
import { DagService } from '../server/services/dag-service';
import { FileService } from '../server/services/file-service';

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

interface User {
  id: string;
  email: string;
  profile?: {
      name: string;
      avatar_url?: string;
  }
}

interface AppState {
  currentProject: Project | null;
  tasks: Task[];
  files: FileNode[];
  isConnected: boolean;
  messages: any[]; // Chat history
  user: User | null;
  authLoading: boolean;
  selectedModel: string;

  // Actions
  setProject: (project: Project) => void;
  setTasks: (tasks: Task[]) => void;
  updateTask: (taskId: string, status: Task['status']) => void;
  addFile: (file: FileNode) => void;
  setFiles: (files: FileNode[]) => void;
  setConnected: (status: boolean) => void;
  addMessage: (msg: any) => void;
  setUser: (user: User | null) => void;
  setAuthLoading: (loading: boolean) => void;
  setSelectedModel: (modelId: string) => void;

  // Async Actions
  fetchProjectData: (projectId: string) => Promise<void>;
  checkSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  currentProject: null,
  tasks: [],
  files: [],
  isConnected: false,
  messages: [],
  user: null,
  authLoading: true,
  selectedModel: 'gemini-3-pro-preview', // Default model

  setProject: (project) => set({ currentProject: project }),
  setTasks: (tasks) => set({ tasks }),
  updateTask: (taskId, status) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, status } : t)
  })),
  addFile: (file) => set((state) => ({ files: [...state.files, file] })),
  setFiles: (files) => set({ files }),
  setConnected: (status) => set({ isConnected: status }),
  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  setUser: (user) => set({ user }),
  setAuthLoading: (loading) => set({ authLoading: loading }),
  setSelectedModel: (modelId) => set({ selectedModel: modelId }),

  fetchProjectData: async (projectId) => {
    try {
        // 1. Fetch Tasks using DagService
        const tasks = await DagService.getProjectTasks(projectId);
        set({ tasks: tasks as Task[] });
    } catch (taskError) {
        console.error("Error fetching tasks:", taskError);
    }

    try {
        // 2. Fetch Files using FileService
        const files = await FileService.getProjectFiles(projectId);
        set({ files: files as FileNode[] });
    } catch (fileError) {
        console.error("Error fetching files:", fileError);
    }
  },

  checkSession: async () => {
      set({ authLoading: true });
      try {
          const { data, error } = await insforge.auth.getCurrentSession();
          if (data?.session?.user) {
              set({ user: data.session.user as any });
          } else {
              set({ user: null });
          }
      } catch (error) {
          console.error("Session check failed", error);
          set({ user: null });
      } finally {
          set({ authLoading: false });
      }
  },

  signOut: async () => {
      await insforge.auth.signOut();
      set({ user: null, currentProject: null });
  }
}));
