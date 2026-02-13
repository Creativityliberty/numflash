
import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const items: { id: AppView; label: string; icon: string }[] = [
    { id: 'builder', label: 'Home', icon: 'grid_view' },
    { id: 'dag', label: 'Flow', icon: 'hub' },
    { id: 'code', label: 'Code', icon: 'terminal' },
    { id: 'data', label: 'Data', icon: 'database' },
    { id: 'artifacts', label: 'History', icon: 'history' },
  ];

  return (
    <nav className="w-16 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark flex flex-col items-center py-4 gap-4 shrink-0 z-40 transition-colors">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onViewChange(item.id)}
          className="relative group p-2"
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
            activeView === item.id 
              ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 shadow-sm ring-1 ring-teal-500/20' 
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}>
            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
          </div>
          
          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap font-medium">
            {item.label}
          </div>
          
          {/* Active Indicator Bar */}
          {activeView === item.id && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full" />
          )}
        </button>
      ))}
      
      <div className="mt-auto flex flex-col gap-4 w-full items-center">
        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
