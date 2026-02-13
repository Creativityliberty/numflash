
import React from 'react';
import { GitBranch, Wifi, Bell, Share2, Rocket } from 'lucide-react';
import clsx from 'clsx';
import { useStore } from '../store/useStore';

interface HeaderProps {
  currentView: string;
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  const { currentProject, isConnected } = useStore();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-xl">N</span>
        </div>
        <div>
            <h1 className="font-bold text-slate-800 dark:text-white leading-tight">
                {currentProject ? currentProject.name : 'Nümflash Studio'}
            </h1>
            <div className="flex items-center gap-2">
                <span className={clsx(
                    "w-2 h-2 rounded-full",
                    isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                )}></span>
                <span className="text-xs text-slate-400 font-medium">
                    {isConnected ? 'InsForge Connected' : 'Offline'}
                </span>
            </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 transition-colors">
            <GitBranch size={14} />
            main
        </button>

        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>

        <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
        </button>

        <button
            onClick={() => {
                // Navigate to Artifacts view or trigger deploy
                // For simplicity, we assume the user clicks this to go to the deployment view
                // In a real router setup, use navigation.
                const event = new CustomEvent('navigate-view', { detail: 'artifacts' });
                window.dispatchEvent(event);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity shadow-md"
        >
            <Rocket size={16} />
            <span>Deploy</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
