
export interface ProjectTemplate {
    id: string;
    name: string;
    description: string;
    framework: 'nextjs' | 'react' | 'node';
    tags: string[];
    files: Array<{ path: string; content: string }>;
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
    {
        id: 'nextjs-saas-starter',
        name: 'Next.js SaaS Starter',
        description: 'Full-stack SaaS boilerplate with Auth, Stripe, and Tailwind CSS.',
        framework: 'nextjs',
        tags: ['SaaS', 'Auth', 'Stripe'],
        files: [
            {
                path: 'package.json',
                content: `{
  "name": "my-saas",
  "version": "0.1.0",
  "dependencies": {
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18",
    "@insforge/sdk": "latest"
  }
}`
            },
            {
                path: 'app/page.tsx',
                content: `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Welcome to your SaaS</h1>
    </main>
  )
}`
            }
        ]
    },
    {
        id: 'react-dashboard',
        name: 'React Admin Dashboard',
        description: 'Modern admin dashboard with charts, data tables, and dark mode.',
        framework: 'react',
        tags: ['Dashboard', 'Admin', 'Charts'],
        files: [
            {
                path: 'package.json',
                content: `{
  "name": "admin-dashboard",
  "dependencies": {
    "react": "^18.2.0",
    "vite": "^5.0.0",
    "recharts": "^2.10.0"
  }
}`
            },
            {
                path: 'src/App.jsx',
                content: `import React from 'react';
export default function App() {
  return <div className="p-4"><h1>Admin Dashboard</h1></div>;
}`
            }
        ]
    },
    {
        id: 'api-serverless',
        name: 'Serverless API',
        description: 'Lightweight API template using Edge Functions.',
        framework: 'node',
        tags: ['API', 'Backend', 'Edge'],
        files: [
            {
                path: 'functions/api.ts',
                content: `export default async function(req: Request) {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}`
            }
        ]
    }
];
