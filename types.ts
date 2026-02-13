
export type AppView = 'agent' | 'builder' | 'dag' | 'code' | 'data' | 'artifacts';

export interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  status?: 'none' | 'deploying' | 'success' | 'failed';
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

export interface FileData {
  id: string;
  name: string;
  icon: string;
  color: string;
  content: string;
}

export interface AppState {
  view: AppView;
  messages: Message[];
  tasks: Task[];
  files: FileData[];
  darkMode: boolean;
}

// Structure attendue pour les réponses IA
export interface AIActionResponse {
  message: string;
  action?: 'add_task' | 'add_file' | 'deploy' | 'none';
  payload?: any;
}
