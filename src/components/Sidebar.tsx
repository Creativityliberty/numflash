
import React from 'react';
import { LayoutDashboard, Network, Code2, Database, Package, Settings, Bot } from 'lucide-react';
import clsx from 'clsx';
import { AppView } from '../types';

interface SidebarProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: 'builder', icon: Bot, label: 'AI Architect' },
    { id: 'dag', icon: Network, label: 'Task Graph' },
    { id: 'code', icon: Code2, label: 'Code Tree' },
    { id: 'data', icon: Database, label: 'Database' },
    { id: 'artifacts', icon: Package, label: 'Artifacts' },
  ];

  return (
    <aside className="w-20 lg:w-64 h-full bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center lg:items-stretch py-6 gap-2 transition-all duration-300">
      <div className="px-4 mb-6 hidden lg:block">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Workspace</h2>
      </div>

      {menuItems.map((item) => {
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as AppView)}
            className={clsx(
              "flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all duration-200 group relative",
              isActive
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
            )}
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span className={clsx(
                "hidden lg:block font-medium",
                isActive ? "text-white" : "text-slate-600 dark:text-slate-300"
            )}>
                {item.label}
            </span>

            {/* Tooltip for mobile/collapsed */}
            <div className="lg:hidden absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
            </div>
          </button>
        );
      })}

      <div className="mt-auto">
          <button className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors w-[calc(100%-16px)]">
              <Settings size={24} />
              <span className="hidden lg:block font-medium">Settings</span>
          </button>
      </div>
    </aside>
  );
};

export default Sidebar;
