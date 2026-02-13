
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AgentView from './views/AgentView';
import BuilderView from './views/BuilderView';
import DAGView from './views/DAGView';
import CodeView from './views/CodeView';
import DataView from './views/DataView';
import ArtifactsView from './views/ArtifactsView';
import { AppView, AppState, Task, FileData, Message } from './types';

const DEFAULT_STATE: AppState = {
  view: 'agent',
  messages: [{ id: '1', sender: 'ai', text: "Bonjour Chef ! Je suis prêt. Que voulez-vous construire aujourd'hui ?" }],
  tasks: [
    { id: '1', text: 'Initialiser le projet Nümflash', completed: true },
    { id: '2', text: 'Connecter Gemini API', completed: true }
  ],
  files: [
    { id: 'f1', name: 'main.ts', icon: 'description', color: 'text-blue-400', content: '// Bienvenue Chef\nconsole.log("Hello World");' }
  ],
  darkMode: true
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('numflash_state');
    return saved ? JSON.parse(saved) : DEFAULT_STATE;
  });

  useEffect(() => {
    localStorage.setItem('numflash_state', JSON.stringify(state));
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const updateState = (patch: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...patch }));
  };

  const renderView = () => {
    switch (state.view) {
      case 'agent': return <AgentView state={state} updateState={updateState} />;
      case 'builder': return <BuilderView state={state} updateState={updateState} />;
      case 'dag': return <DAGView />;
      case 'code': return <CodeView state={state} updateState={updateState} />;
      case 'data': return <DataView />;
      case 'artifacts': return <ArtifactsView />;
      default: return <AgentView state={state} updateState={updateState} />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background-light dark:bg-background-dark transition-colors duration-500">
      <Header currentView={state.view} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={state.view} onViewChange={(v) => updateState({ view: v })} />
        
        <main className="flex-1 overflow-hidden relative">
          {renderView()}
        </main>
      </div>

      <button 
        onClick={() => updateState({ darkMode: !state.darkMode })}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl shadow-modern border border-border-light dark:border-border-dark flex items-center justify-center hover:scale-110 transition-all active:scale-95"
      >
        <span className="material-symbols-outlined">
          {state.darkMode ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
    </div>
  );
};

export default App;
