
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import BuilderView from './views/BuilderView';
import DAGView from './views/DAGView';
import CodeView from './views/CodeView';
import DataView from './views/DataView';
import ArtifactsView from './views/ArtifactsView';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('builder');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderView = () => {
    switch (currentView) {
      case 'builder': return <BuilderView />;
      case 'dag': return <DAGView />;
      case 'code': return <CodeView />;
      case 'data': return <DataView />;
      case 'artifacts': return <ArtifactsView />;
      default: return <BuilderView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <Header currentView={currentView} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeView={currentView} onViewChange={setCurrentView} />
        
        <main className="flex-1 overflow-hidden">
          {renderView()}
        </main>
      </div>

      <button 
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-primary text-white rounded-full shadow-elevation-3 flex items-center justify-center hover:bg-teal-700 transition transform hover:scale-110"
      >
        <span className="material-icons-round">
          {isDarkMode ? 'light_mode' : 'dark_mode'}
        </span>
      </button>
    </div>
  );
};

export default App;
