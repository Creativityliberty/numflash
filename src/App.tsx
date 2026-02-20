
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BuilderView from './views/BuilderView';
import DAGView from './views/DAGView';
import CodeView from './views/CodeView';
import ArtifactsView from './views/ArtifactsView';
import DataView from './views/DataView';
import AuthView from './views/AuthView';
import SettingsView from './views/SettingsView';
import ProjectListView from './views/ProjectListView';
import TaskRunner from './components/TaskRunner';
import { AppView } from './types';
import { useStore } from './store/useStore';
import { Loader2 } from 'lucide-react';
import { ToastProvider } from './components/Toast';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('builder');
  const { currentProject, checkSession, user, authLoading } = useStore();
  const [darkMode, setDarkMode] = useState(true);

  // Listen for navigation events
  useEffect(() => {
      const handleNavigation = (e: any) => {
          if (e.detail) setCurrentView(e.detail);
      };
      window.addEventListener('navigate-view', handleNavigation);
      return () => window.removeEventListener('navigate-view', handleNavigation);
  }, []);

  // Check Session
  useEffect(() => {
      checkSession();
  }, [checkSession]);

  // Dark Mode
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
      case 'data': return <DataView />;
      case 'artifacts': return <ArtifactsView />;
      case 'settings': return <SettingsView />;
      default: return <BuilderView />;
    }
  };

  if (authLoading) {
      return (
          <div className="h-screen w-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-500">
              <Loader2 className="animate-spin w-10 h-10 text-blue-500" />
          </div>
      );
  }

  if (!user) {
      return <AuthView />;
  }

  // If no project is selected and user is not in Settings, show Project List
  if (!currentProject && currentView !== 'settings') {
      return (
        <div className="flex flex-col h-screen w-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">
             {/* Header simplified for project selection */}
            <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="text-white font-bold text-xl">N</span>
                    </div>
                    <h1 className="font-bold text-slate-800 dark:text-white">Nümflash Studio</h1>
                </div>
                {/* Access settings even without project */}
                <button
                  onClick={() => setCurrentView('settings')}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  Config
                </button>
            </header>
            <main className="flex-1 overflow-hidden">
                <ProjectListView />
            </main>
        </div>
      );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">
      <TaskRunner />
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

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
