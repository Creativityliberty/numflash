
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BuilderView from './views/BuilderView';
import DAGView from './views/DAGView';
import CodeView from './views/CodeView';
import ArtifactsView from './views/ArtifactsView';
import { AppView } from './types';
import { useStore } from './store/useStore';
import { insforge } from './lib/insforge';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('builder');
  const { setProject, fetchProjectData, setConnected } = useStore();
  const [darkMode, setDarkMode] = useState(true);

  // Initialisation Mock Project & Connection
  useEffect(() => {
    // Simuler un projet existant ou créer un nouveau
    const initProject = async () => {
        const projectId = "proj_demo_123"; // TODO: Should come from URL or Project Selection
        setProject({
            id: projectId,
            name: "Demo SaaS CRM",
            owner_id: "user_1",
            created_at: new Date().toISOString()
        });

        // Connect Realtime
        await insforge.realtime.connect();
        setConnected(true);

        // Fetch Data
        await fetchProjectData(projectId);
    };

    initProject();
  }, [setProject, fetchProjectData, setConnected]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderView = () => {
    switch (currentView) {
      case 'builder': return <BuilderView />;
      case 'dag': return <DAGView />;
      case 'code': return <CodeView />;
      case 'artifacts': return <ArtifactsView />;
      default: return <BuilderView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      <Header currentView={currentView} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={currentView} onViewChange={setCurrentView} />

        <main className="flex-1 overflow-hidden relative bg-white dark:bg-slate-900 m-2 rounded-2xl shadow-inner border border-slate-200 dark:border-slate-800">
          {renderView()}
        </main>
      </div>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:scale-110 transition-all active:scale-95"
      >
        <span className="material-symbols-outlined">
          {darkMode ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
    </div>
  );
};

export default App;
