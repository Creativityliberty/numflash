
-- Activation de l'extension pour les UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table des Projets
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table des Tâches (DAG récursif)
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
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
  storage_key TEXT NOT NULL,
  storage_url TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Sécurité : Activation du Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Politiques RLS Strictes (Multi-Tenant)

-- Projects: Only Owner can CRUD
CREATE POLICY "Users can only access their own projects" ON projects
  FOR ALL USING (auth.uid() = owner_id);

-- Tasks: Only Owner of the project can CRUD
-- Optimization: Using EXISTS is generally faster/cleaner than IN subquery for large datasets
CREATE POLICY "Users can access their own tasks" ON tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- Files: Only Owner of the project can CRUD
CREATE POLICY "Users can access their own files" ON files
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = files.project_id
      AND projects.owner_id = auth.uid()
    )
  );
