
import React from 'react';

const DataView: React.FC = () => {
  const rows = [
    { id: 101, name: 'Alex Morgan', email: 'alex.morgan@example.com', role: 'admin', active: true, date: '2023-10-15' },
    { id: 102, name: 'Jamie Smith', email: 'jamie.s@example.com', role: 'editor', active: true, date: '2023-10-16' },
    { id: 103, name: 'Taylor Doe', email: 'taylor.doe@example.com', role: 'viewer', active: false, date: '2023-10-18' },
    { id: 104, name: 'Casey Jones', email: 'casey.j@example.com', role: 'viewer', active: true, date: '2023-10-19' },
    { id: 105, name: 'Riley Reid', email: 'riley.r@example.com', role: 'viewer', active: true, date: '2023-10-20' },
  ];

  return (
    <div className="h-full bg-surface-variant-light dark:bg-surface-variant-dark p-4 gap-4 flex overflow-hidden transition-colors">
      <section className="w-64 bg-surface-light dark:bg-surface-dark rounded-3xl shadow-elevation-1 flex flex-col border border-white/50 dark:border-white/5 overflow-hidden shrink-0">
        <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center justify-between">
          <h2 className="text-xs font-semibold tracking-wide uppercase text-slate-500">Explorer</h2>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-primary transition"><span className="material-icons-round text-sm">add</span></button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase mt-2 mb-1">Tables</div>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-full bg-secondary-container dark:bg-primary/20 text-on-secondary-container dark:text-primary-container font-medium text-sm">
            <span className="material-icons-round text-sm">table_chart</span>
            <span>users</span>
            <span className="ml-auto text-[10px] opacity-70">12.4k</span>
          </button>
          {['products', 'orders', 'reviews'].map(t => (
            <button key={t} className="w-full flex items-center gap-3 px-3 py-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 font-medium text-sm">
              <span className="material-icons-round text-sm text-slate-400">table_chart</span>
              <span className="capitalize">{t}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="flex-1 bg-surface-light dark:bg-surface-dark rounded-3xl shadow-elevation-1 flex flex-col border border-white/50 dark:border-white/5 overflow-hidden">
        <div className="h-14 px-6 border-b border-border-light dark:border-border-dark flex items-center justify-between bg-white/50 dark:bg-black/20 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-6 h-full text-sm font-medium">
            <button className="h-full border-b-2 border-primary text-primary px-2">Data</button>
            <button className="h-full border-b-2 border-transparent text-slate-500 hover:text-slate-800">Schema</button>
            <button className="h-full border-b-2 border-transparent text-slate-500 hover:text-slate-800">Policies</button>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="material-icons-round absolute left-2.5 top-1.5 text-slate-400 text-lg">search</span>
              <input className="pl-9 pr-4 py-1.5 text-xs bg-slate-100 dark:bg-surface-variant-dark border-none rounded-full w-48" placeholder="Search..." type="text"/>
            </div>
            <button className="px-3 py-1.5 bg-primary text-white rounded-full text-xs font-medium shadow-sm hover:bg-teal-700">Add Row</button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-surface-light dark:bg-surface-dark relative">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-surface-variant-dark text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 border-b border-r border-slate-200 dark:border-slate-700 w-12 text-center"><input type="checkbox" className="rounded"/></th>
                <th className="px-4 py-3 border-b border-r border-slate-200 dark:border-slate-700">id</th>
                <th className="px-4 py-3 border-b border-r border-slate-200 dark:border-slate-700">full_name</th>
                <th className="px-4 py-3 border-b border-r border-slate-200 dark:border-slate-700">email</th>
                <th className="px-4 py-3 border-b border-r border-slate-200 dark:border-slate-700">active</th>
                <th className="px-4 py-3 border-b border-r border-slate-200 dark:border-slate-700">role</th>
                <th className="px-4 py-3 border-b">created_at</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {rows.map(row => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                  <td className="px-4 py-3 border-r border-slate-100 dark:border-slate-800 text-center"><input type="checkbox" className="rounded"/></td>
                  <td className="px-4 py-3 border-r border-slate-100 dark:border-slate-800 font-mono text-slate-500">{row.id}</td>
                  <td className="px-4 py-3 border-r border-slate-100 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-200">{row.name}</td>
                  <td className="px-4 py-3 border-r border-slate-100 dark:border-slate-800 text-slate-500">{row.email}</td>
                  <td className="px-4 py-3 border-r border-slate-100 dark:border-slate-800">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${row.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                      {row.active ? 'TRUE' : 'FALSE'}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-r border-slate-100 dark:border-slate-800 capitalize">{row.role}</td>
                  <td className="px-4 py-3 text-slate-500">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="h-12 px-6 border-t border-border-light dark:border-border-dark flex items-center justify-between text-xs text-slate-500 transition-colors">
          <div>Showing 1-5 of 12,402 records</div>
          <div className="flex gap-2">
            <button className="p-1 hover:bg-slate-100 rounded-full transition"><span className="material-icons-round">chevron_left</span></button>
            <button className="p-1 hover:bg-slate-100 rounded-full transition"><span className="material-icons-round">chevron_right</span></button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DataView;
