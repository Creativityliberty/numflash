
import React from 'react';

const ArtifactsView: React.FC = () => {
  return (
    <div className="h-full bg-surface-variant-light dark:bg-surface-variant-dark p-6 overflow-hidden flex flex-col gap-6 transition-colors">
      <div className="flex items-center justify-between shrink-0">
        <h2 className="text-2xl font-normal text-slate-800 dark:text-slate-200">Deployments & History</h2>
        <div className="flex gap-2 bg-surface-light dark:bg-surface-dark p-1 rounded-full border border-border-light dark:border-border-dark">
          <button className="px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-medium shadow-sm">All</button>
          <button className="px-4 py-1.5 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-medium">Production</button>
          <button className="px-4 py-1.5 rounded-full text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-medium">Staging</button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-full overflow-hidden">
        <div className="col-span-8 flex flex-col gap-4 overflow-y-auto pr-2 pb-20">
          <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-elevation-1 border border-primary/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-[100px] -mr-8 -mt-8 pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <span className="material-symbols-outlined">check_circle</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Release v2.4.0</h3>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className="font-mono bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">83a21bc</span>
                    <span>• Deployed 2h ago</span>
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase border border-emerald-200">Production</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6 relative z-10">
              <div className="bg-slate-50 dark:bg-surface-variant-dark rounded-xl p-3">
                <span className="text-[10px] text-slate-500 block mb-1">Build Time</span>
                <span className="text-sm font-medium">1m 42s</span>
              </div>
              <div className="bg-slate-50 dark:bg-surface-variant-dark rounded-xl p-3">
                <span className="text-[10px] text-slate-500 block mb-1">Region</span>
                <span className="text-sm font-medium">us-east-1</span>
              </div>
              <div className="bg-slate-50 dark:bg-surface-variant-dark rounded-xl p-3">
                <span className="text-[10px] text-slate-500 block mb-1">Artifact Size</span>
                <span className="text-sm font-medium">42.8 MB</span>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-elevation-1 border border-border-light dark:border-border-dark hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                  <span className="material-symbols-outlined">science</span>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-800 dark:text-slate-100">Release v2.4.1-rc1</h3>
                  <div className="text-[10px] text-slate-500">91c42ef • Deployed 15m ago</div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase border border-blue-200">Staging</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">Fix: Updated edge function caching logic for user dashboard endpoints.</p>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-slate-100 dark:bg-surface-variant-dark rounded-full text-xs font-medium">Preview</button>
              <button className="text-primary text-xs font-bold hover:underline">Promote to Prod</button>
            </div>
          </div>
        </div>

        <div className="col-span-4 flex flex-col gap-6">
          <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-elevation-1 border border-border-light dark:border-border-dark">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">ecg_heart</span>
              Health Status
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>CPU Usage</span>
                  <span className="font-bold text-emerald-600">24%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-1/4"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Memory</span>
                  <span className="font-bold text-amber-600">68%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-2/3"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-light dark:bg-surface-dark rounded-3xl p-6 shadow-elevation-1 border border-border-light dark:border-border-dark flex-1">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-4">Build Artifacts</h3>
            <div className="space-y-3">
              {['api-worker.js', 'styles.css', 'manifest.json'].map(a => (
                <div key={a} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition cursor-pointer group">
                  <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-base">extension</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate">{a}</div>
                    <div className="text-[10px] text-slate-500">v2.4.0 • 2.4 MB</div>
                  </div>
                  <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 text-slate-400">download</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtifactsView;
