
import React, { useState } from 'react';

const DAGView: React.FC = () => {
  return (
    <div className="h-full flex overflow-hidden relative transition-colors bg-slate-50 dark:bg-slate-950">
      <div className="flex-1 relative dag-dot-bg overflow-hidden">
        {/* Modern Floating Controls */}
        <div className="absolute top-6 left-6 z-20 flex flex-col gap-4">
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl shadow-modern p-1.5 flex items-center gap-1 border border-white/50 dark:border-slate-800">
            {['near_me', 'pan_tool', 'add_box', 'search'].map((icon, i) => (
              <button key={i} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all">
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
              </button>
            ))}
          </div>
          
          <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-2xl text-[11px] font-bold border border-emerald-500/20 flex items-center gap-2 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
            LIVE ENVIRONMENT • v2.4
          </div>
        </div>

        {/* Canvas Area */}
        <div className="absolute inset-0 cursor-crosshair flex items-center justify-center">
          <div className="relative w-full max-w-4xl p-12">
            {/* SVG Connections with Glow */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              <path 
                className="text-slate-200 dark:text-slate-800" 
                d="M 220 100 Q 350 100, 480 200" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              />
              <path 
                className="text-teal-500/40" 
                d="M 220 100 Q 350 100, 480 200" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                filter="url(#glow)"
              />
            </svg>

            {/* Premium Nodes */}
            <div className="absolute top-0 left-0 w-56 group">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-modern transition-all group-hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                    <span className="material-symbols-outlined">api</span>
                  </div>
                  <span className="material-icons-round text-emerald-500 text-sm">check_circle</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Webhook Source</h4>
                <p className="text-[10px] text-slate-400 mt-1">/api/v1/orders/ingest</p>
              </div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-full z-20 cursor-pointer hover:scale-125 transition-transform" />
            </div>

            <div className="absolute top-44 left-1/2 w-56 group">
              <div className="bg-white dark:bg-slate-900 border-2 border-teal-500 p-4 rounded-3xl shadow-glow transition-all group-hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500 text-white flex items-center justify-center">
                    <span className="material-symbols-outlined">auto_fix</span>
                  </div>
                  <span className="material-icons-round text-teal-500 text-sm spin">sync</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">AI Logic Layer</h4>
                <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-teal-500 w-[70%]" />
                </div>
              </div>
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-slate-900 border-2 border-teal-500 rounded-full z-20" />
            </div>
          </div>
        </div>
      </div>

      {/* Modern Inspector Panel */}
      <aside className="w-80 bg-white dark:bg-slate-900 border-l border-border-light dark:border-border-dark flex flex-col shadow-2xl z-30 overflow-hidden">
        <div className="h-14 px-6 border-b border-border-light dark:border-border-dark flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Node Inspector</span>
          <button className="text-slate-300 hover:text-slate-500"><span className="material-icons-round text-sm">close</span></button>
        </div>
        <div className="p-6 space-y-8 overflow-y-auto no-scrollbar">
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-2 uppercase">Configuration</label>
              <div className="space-y-3">
                <input className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs px-4 py-3 placeholder-slate-500" placeholder="Node Name" defaultValue="AI Logic Layer" />
                <textarea className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs px-4 py-3 h-24 no-scrollbar" placeholder="Description" defaultValue="Advanced transformer logic for cleaning input order data." />
              </div>
            </div>
            
            <div className="p-4 bg-teal-500/5 rounded-2xl border border-teal-500/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-teal-600">Auto-Scaling</span>
                <div className="w-8 h-4 bg-teal-500 rounded-full relative"><div className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full" /></div>
              </div>
              <p className="text-[10px] text-teal-700/60 leading-relaxed">Scaling parameters are currently set to dynamically adjust based on queue length.</p>
            </div>
          </div>
          
          <button className="w-full py-3 bg-teal-600 text-white rounded-2xl text-xs font-bold shadow-glow hover:bg-teal-700 transition-colors">Apply Changes</button>
        </div>
      </aside>
    </div>
  );
};

export default DAGView;
