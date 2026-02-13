
import React from 'react';
import { AppState } from '../types';

interface BuilderViewProps {
  state: AppState;
  updateState: (patch: Partial<AppState>) => void;
}

const BuilderView: React.FC<BuilderViewProps> = ({ state, updateState }) => {
  const toggleTask = (id: string) => {
    const updatedTasks = state.tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    updateState({ tasks: updatedTasks });
  };

  return (
    <div className="h-full bg-background-light dark:bg-background-dark p-6 grid grid-cols-12 grid-rows-6 gap-6 overflow-hidden">
      <section className="col-span-12 lg:col-span-8 row-span-4 bg-surface-light dark:bg-surface-dark rounded-3xl border border-border-light dark:border-border-dark shadow-modern overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-500">mediation</span>
            <span className="text-sm font-semibold tracking-tight">Active Flow Orchestration</span>
          </div>
        </div>
        <div className="flex-1 dag-dot-bg relative flex items-center justify-center">
            <div className="text-center p-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">hub</span>
                <p className="text-sm text-slate-500">Drag & Drop nodes to build your DAG</p>
            </div>
        </div>
      </section>

      <section className="col-span-12 lg:col-span-4 row-span-6 flex flex-col gap-6 overflow-hidden">
        <div className="flex-1 bg-surface-light dark:bg-surface-dark rounded-3xl border border-border-light dark:border-border-dark shadow-modern p-6 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold tracking-tight">Active Roadmap</h3>
            <span className="text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full font-bold">
              {state.tasks.filter(t => t.completed).length}/{state.tasks.length} COMPLETE
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar">
            {state.tasks.map(task => (
              <button 
                key={task.id} 
                onClick={() => toggleTask(task.id)}
                className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all border ${
                  task.completed 
                    ? 'bg-slate-50/50 dark:bg-slate-800/30 border-transparent' 
                    : 'bg-white dark:bg-slate-800 border-border-light dark:border-slate-700 hover:border-teal-500/50 shadow-sm'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  task.completed ? 'bg-teal-500 text-white' : 'border-2 border-slate-200 dark:border-slate-600'
                }`}>
                  {task.completed && <span className="material-icons-round text-[14px]">done</span>}
                </div>
                <span className={`text-xs font-medium text-left ${
                  task.completed ? 'text-slate-400 line-through opacity-50' : 'text-slate-700 dark:text-slate-200'
                }`}>
                  {task.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default BuilderView;
