
export type AppView = 'builder' | 'dag' | 'code' | 'data' | 'artifacts';

export interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  diff?: { removed: string; added: string };
  action?: {
    name: string;
    status: 'running' | 'success' | 'failed';
    steps: { name: string; status: 'done' | 'running' | 'pending' }[];
  };
}

export interface NodeData {
  id: string;
  label: string;
  type: string;
  status: 'success' | 'running' | 'pending' | 'warning';
  description?: string;
  position: { x: number; y: number };
}

export interface FileData {
  name: string;
  type: 'file' | 'folder';
  language?: string;
  content?: string;
  isOpen?: boolean;
  children?: FileData[];
}
