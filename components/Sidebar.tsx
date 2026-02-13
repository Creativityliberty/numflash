
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const items: { id: AppView; label: string; icon: string }[] = [
    { id: 'agent', label: 'Agent', icon: 'auto_awesome' },
    { id: 'builder', label: 'Dashboard', icon: 'grid_view' },
    { id: 'dag', label: 'Flow', icon: 'hub' },
    { id: 'code', label: 'Studio', icon: 'terminal' },
    { id: 'data', label: 'Data', icon: 'database' },
    { id: 'artifacts', label: 'History', icon: 'history' },
  ];

  return (
    <nav className="w-16 bg-white dark:bg-slate-950 border-r border-border-light dark:border-border-dark flex flex-col items-center py-6 gap-4 shrink-0 z-40 transition-colors">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className="relative group p-2"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            activeView === item.id 
              ? 'bg-teal-500 text-white shadow-glow' 
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}>
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
          </div>
          
          <div className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 whitespace-nowrap font-medium shadow-xl translate-x-[-10px] group-hover:translate-x-0">
            {item.label}
          </div>
        </button>
      ))}
    </nav>
  );
};

export default Sidebar;
