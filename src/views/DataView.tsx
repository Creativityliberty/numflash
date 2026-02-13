
import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Database, Table, RefreshCw, Lock } from 'lucide-react';
import clsx from 'clsx';

const DataView = () => {
    const { currentProject, tasks, files, fetchProjectData } = useStore();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeTable, setActiveTable] = useState<'tasks' | 'files'>('tasks');

    const handleRefresh = async () => {
        if (!currentProject) return;
        setIsRefreshing(true);
        await fetchProjectData(currentProject.id);
        setIsRefreshing(false);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-950 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Database className="text-blue-500" /> Database Inspector
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                        View live data stored in your InsForge PostgreSQL database.
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    className={clsx(
                        "p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors",
                        isRefreshing && "animate-spin"
                    )}
                >
                    <RefreshCw size={20} className="text-slate-500 dark:text-slate-300" />
                </button>
            </div>

            {/* RLS Badge */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-xl flex items-start gap-3">
                <Lock className="text-blue-600 dark:text-blue-400 mt-0.5" size={18} />
                <div>
                    <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300">Row Level Security (RLS) Active</h4>
                    <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        You are only viewing data belonging to your authenticated user ID. Direct access is secured by InsForge policies.
                    </p>
                </div>
            </div>

            {/* Table Tabs */}
            <div className="flex gap-2 mb-4">
                <button
                    onClick={() => setActiveTable('tasks')}
                    className={clsx(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                        activeTable === 'tasks'
                            ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900"
                            : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    )}
                >
                    <Table size={16} /> public.tasks ({tasks.length})
                </button>
                <button
                    onClick={() => setActiveTable('files')}
                    className={clsx(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                        activeTable === 'files'
                            ? "bg-slate-800 text-white dark:bg-white dark:text-slate-900"
                            : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    )}
                >
                    <Table size={16} /> public.files ({files.length})
                </button>
            </div>

            {/* Data Table */}
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-950/50 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                            <tr>
                                {activeTable === 'tasks' ? (
                                    <>
                                        <th className="px-4 py-3 font-semibold">ID</th>
                                        <th className="px-4 py-3 font-semibold">Title</th>
                                        <th className="px-4 py-3 font-semibold">Status</th>
                                        <th className="px-4 py-3 font-semibold">Agent</th>
                                    </>
                                ) : (
                                    <>
                                        <th className="px-4 py-3 font-semibold">ID</th>
                                        <th className="px-4 py-3 font-semibold">Path</th>
                                        <th className="px-4 py-3 font-semibold">Storage Key</th>
                                        <th className="px-4 py-3 font-semibold">URL</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {activeTable === 'tasks' && tasks.map(task => (
                                <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{task.id.slice(0, 8)}...</td>
                                    <td className="px-4 py-3 text-slate-800 dark:text-slate-200">{task.title}</td>
                                    <td className="px-4 py-3">
                                        <span className={clsx(
                                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide",
                                            task.status === 'completed' ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                                            task.status === 'running' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                                            "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                        )}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">{task.agent_type}</td>
                                </tr>
                            ))}

                            {activeTable === 'files' && files.map(file => (
                                <tr key={file.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs text-slate-400">{file.id.slice(0, 8)}...</td>
                                    <td className="px-4 py-3 font-mono text-xs text-blue-600 dark:text-blue-400">{file.path}</td>
                                    <td className="px-4 py-3 text-slate-500 text-xs">{file.storage_key}</td>
                                    <td className="px-4 py-3 text-slate-500 text-xs truncate max-w-[200px]">{file.storage_url}</td>
                                </div>
                            ))}

                            {(activeTable === 'tasks' ? tasks : files).length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400 italic">
                                        No data found in this table.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DataView;
