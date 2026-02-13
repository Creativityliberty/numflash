-- Activation de l'extension pour les UUID si nécessaire
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table des Projets
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id), -- Liaison avec l'auth InsForge
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table des Tâches (DAG récursif)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES tasks(id) ON DELETE CASCADE, -- Récursivité
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed')),
  agent_type TEXT DEFAULT 'worker',
  depth INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table des Fichiers (Code Tree)
CREATE TABLE files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  path TEXT NOT NULL,
  storage_key TEXT NOT NULL, -- Clé pour le Storage SDK
  storage_url TEXT NOT NULL, -- URL publique de rendu live
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sécurité : Activation du Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Politique simple : l'utilisateur ne voit que ses propres projets
CREATE POLICY "Users can only access their own projects" ON projects
  FOR ALL USING (auth.uid() = owner_id);

CREATE POLICY "Users can access their own tasks" ON tasks
  FOR ALL USING (project_id IN (SELECT id FROM projects));

CREATE POLICY "Users can access their own files" ON files
  FOR ALL USING (project_id IN (SELECT id FROM projects));
