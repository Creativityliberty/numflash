
import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
}

const Header: React.FC<HeaderProps> = ({ currentView }) => {
  // Added 'agent' key to satisfy the Record<AppView, string> constraint as per types.ts
  const viewTitles: Record<AppView, string> = {
    agent: 'Agent',
    builder: 'Dashboard',
    dag: 'Orchestrator',
    code: 'Studio',
    data: 'Database',
    artifacts: 'Deployments'
  };

  return (
    <header className="h-14 px-6 flex items-center justify-between glass-header border-b border-border-light dark:border-border-dark shrink-0 z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white shadow-glow group-hover:scale-110 transition-transform">
            <span className="material-icons-round text-xl">bolt</span>
          </div>
          <span className="font-semibold text-sm tracking-tight hidden sm:block">Nümflash</span>
        </div>
        
        <div className="h-4 w-px bg-border-light dark:bg-border-dark" />
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">{viewTitles[currentView]}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg border border-border-light dark:border-border-dark">
          <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-600 flex items-center justify-center text-[10px] font-bold">JD</div>
          <div className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-600 flex items-center justify-center text-[10px] font-bold">AL</div>
          <button className="w-6 h-6 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors">
            <span className="material-icons-round text-xs text-slate-400">add</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 dark:bg-teal-600 text-white rounded-lg text-xs font-medium hover:opacity-90 transition-all active:scale-95 shadow-sm">
            <span className="material-icons-round text-sm">rocket_launch</span>
            Deploy
          </button>
          <div className="w-8 h-8 rounded-full border border-border-light dark:border-border-dark p-0.5 overflow-hidden ml-1">
            <img 
              alt="Profile" 
              className="w-full h-full object-cover rounded-full" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2ba0PUvSJ2tHFShGNqN4__iRtc3Q-jVv7k-EI8M9hQgeIEVta_cmsXsqaxWAk73oSliVV6Su-SqtlVNjcv5adJEkqemOMJfU0Ph2Z9RIeqi787pYlpEYY3vwiFU-dA5jEJDO69wu1AR0cjbAsWa4_rktk8K-56rStdmfTE-BbdKr-mAjOAdXXvhDUU_olEQTEKFe-SkDXuZmvKyejwBC03O6gh02xMmVmeaySNjgwCj7YEFkRUxVb9o8FPM0ReEALbb6fS_8Kxb-n"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
