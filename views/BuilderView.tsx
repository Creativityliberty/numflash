
import React, { useState } from 'react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const BuilderView: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 't1', text: 'Update Cart Validation logic', completed: false },
    { id: 't2', text: 'Optimize SQL queries in products table', completed: false },
    { id: 't3', text: 'Configure Webhook listener for Stripe', completed: true },
    { id: 't4', text: 'Redeploy edge functions', completed: false },
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  return (
    <div className="h-full bg-background-light dark:bg-background-dark p-6 grid grid-cols-12 grid-rows-6 gap-6 overflow-hidden">
      
      {/* Main Flow Card */}
      <section className="col-span-12 lg:col-span-8 row-span-4 bg-surface-light dark:bg-surface-dark rounded-3xl border border-border-light dark:border-border-dark shadow-modern overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-teal-500">mediation</span>
            <span className="text-sm font-semibold tracking-tight">Active Flow Orchestration</span>
          </div>
          <div className="flex gap-1">
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">fullscreen</span></button>
            <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">more_vert</span></button>
          </div>
        </div>
        <div className="flex-1 dag-dot-bg relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl px-12 py-8">
            <div className="flex items-center justify-between relative">
              {/* Nodes with better styling */}
              <div className="w-40 bg-surface-light dark:bg-slate-800 border border-border-light dark:border-slate-700 p-3 rounded-2xl shadow-modern z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase text-slate-400">Trigger</span>
                </div>
                <div className="text-xs font-semibold">Incoming Order</div>
              </div>
              
              <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700 mx-4 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-teal-500 shadow-glow" />
              </div>

              <div className="w-40 bg-surface-light dark:bg-slate-800 border-2 border-teal-500/30 p-3 rounded-2xl shadow-modern z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500" />
                  <span className="text-[10px] font-bold uppercase text-slate-400">Processing</span>
                </div>
                <div className="text-xs font-semibold">Transformer V2</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Task & AI Side Sidebar */}
      <section className="col-span-12 lg:col-span-4 row-span-6 flex flex-col gap-6 overflow-hidden">
        {/* Quick Tasks Widget */}
        <div className="flex-1 bg-surface-light dark:bg-surface-dark rounded-3xl border border-border-light dark:border-border-dark shadow-modern p-6 flex flex-col overflow-hidden transition-all hover:border-teal-500/30">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold tracking-tight">Active Roadmap</h3>
            <span className="text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full font-bold">
              {tasks.filter(t => t.completed).length}/{tasks.length} COMPLETE
            </span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 no-scrollbar">
            {tasks.map(task => (
              <button 
                key={task.id} 
                onClick={() => toggleTask(task.id)}
                className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all border ${
                  task.completed 
                    ? 'bg-slate-50/50 dark:bg-slate-800/30 border-transparent completed' 
                    : 'bg-white dark:bg-slate-800 border-border-light dark:border-slate-700 hover:border-teal-500/50 shadow-sm'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  task.completed ? 'bg-teal-500 text-white' : 'border-2 border-slate-200 dark:border-slate-600'
                }`}>
                  {task.completed && <span className="material-icons-round text-[14px]">done</span>}
                </div>
                <span className={`text-xs font-medium text-left task-strike ${
                  task.completed ? 'text-slate-400' : 'text-slate-700 dark:text-slate-200'
                }`}>
                  {task.text}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* AI Mini Chat / Suggestions */}
        <div className="h-56 bg-teal-900 text-white rounded-3xl p-6 shadow-glow flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-700">
            <span className="material-symbols-outlined text-6xl">auto_awesome</span>
          </div>
          <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
            <span className="material-icons-round text-sm">sparkles</span>
            AI Copilot
          </h3>
          <p className="text-xs text-teal-100/80 leading-relaxed mb-4">
            "I've detected a performance bottleneck in your transformer node. Would you like me to optimize the memory usage?"
          </p>
          <div className="mt-auto flex gap-2">
            <button className="px-4 py-2 bg-white text-teal-900 rounded-xl text-[10px] font-bold shadow-sm hover:scale-105 transition-transform">Optimize Now</button>
            <button className="px-4 py-2 bg-teal-800 text-white rounded-xl text-[10px] font-bold hover:bg-teal-700 transition-colors">Details</button>
          </div>
        </div>
      </section>

      {/* Small Context Widgets */}
      <section className="col-span-12 lg:col-span-4 row-span-2 bg-surface-light dark:bg-surface-dark rounded-3xl border border-border-light dark:border-border-dark shadow-modern p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <span className="material-symbols-outlined">data_object</span>
          </div>
          <div>
            <div className="text-xs font-bold">API Traffic</div>
            <div className="text-[10px] text-slate-400">Last 24 hours</div>
          </div>
        </div>
        <div className="flex items-end gap-1 h-12">
          {[40, 60, 45, 90, 65, 80, 50, 75, 95, 60].map((h, i) => (
            <div key={i} className="flex-1 bg-indigo-500 rounded-t-[2px]" style={{ height: `${h}%` }} />
          ))}
        </div>
      </section>

      <section className="col-span-12 lg:col-span-4 row-span-2 bg-slate-900 text-white rounded-3xl p-6 shadow-modern flex items-center justify-between">
        <div>
          <div className="text-xs font-bold text-slate-400 mb-1">Status</div>
          <div className="text-xl font-semibold">Healthy</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            99.9% Uptime
          </div>
        </div>
        <div className="w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center">
          <span className="text-xs font-bold">V 2.4</span>
        </div>
      </section>
    </div>
  );
};

export default BuilderView;
