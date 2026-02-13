
import React, { useState } from 'react';
import { AppState } from '../types';

interface CodeViewProps {
  state: AppState;
  updateState: (patch: Partial<AppState>) => void;
}

const CodeView: React.FC<CodeViewProps> = ({ state, updateState }) => {
  const [activeFileId, setActiveFileId] = useState(state.files[0]?.id || '');
  const activeFile = state.files.find(f => f.id === activeFileId);

  return (
    <div className="h-full bg-surface-variant-light dark:bg-surface-variant-dark p-2 flex gap-2 overflow-hidden transition-colors">
      <aside className="w-64 flex flex-col bg-surface-light dark:bg-surface-dark rounded-2xl border border-white/50 dark:border-white/5 shadow-elevation-1 overflow-hidden shrink-0">
        <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center justify-between shrink-0">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Explorer</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          <div className="pl-2">
            {state.files.map(f => (
              <div 
                key={f.id}
                onClick={() => setActiveFileId(f.id)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  activeFileId === f.id ? 'bg-primary/10 dark:bg-primary/20 text-primary font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className={`material-icons-round ${f.color} text-base`}>{f.icon}</span>
                <span className="truncate text-xs">{f.name}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <section className="flex-1 flex flex-col gap-2 overflow-hidden h-full">
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-elevation-1 border border-white/50 dark:border-white/5 overflow-hidden relative">
          <div className="h-10 flex bg-slate-50 dark:bg-slate-950 border-b border-border-light dark:border-black/40">
            {state.files.map(f => (
              <div 
                key={f.id}
                onClick={() => setActiveFileId(f.id)}
                className={`flex items-center min-w-[140px] px-4 text-xs font-medium cursor-pointer transition-colors select-none ${
                  activeFileId === f.id ? 'bg-white dark:bg-slate-900 border-t-2 border-primary text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'
                }`}
              >
                <span className="truncate">{f.name}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-6 relative text-slate-800 dark:text-slate-300 scroll-smooth">
            <pre className="whitespace-pre-wrap">{activeFile?.content || '// Aucun fichier sélectionné'}</pre>
          </div>
        </div>

        <div className="h-40 bg-white dark:bg-slate-900 rounded-2xl shadow-elevation-1 border border-white/50 dark:border-white/5 flex flex-col overflow-hidden shrink-0">
          <div className="h-10 px-4 bg-slate-50 dark:bg-slate-950 flex items-center justify-between border-b border-border-light dark:border-white/5">
            <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">Terminal</div>
          </div>
          <div className="flex-1 bg-black/90 p-3 font-mono text-[11px] text-green-400 overflow-y-auto">
            <div>$ nümflash status</div>
            <div className="text-white mt-1">Ready for deployment. All files synced.</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CodeView;
