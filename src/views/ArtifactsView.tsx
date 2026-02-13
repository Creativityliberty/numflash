
import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { DeployService } from '../server/services/deploy-service';
import { Rocket, CheckCircle, AlertCircle, Loader2, ExternalLink, Package } from 'lucide-react';
import clsx from 'clsx';

const ArtifactsView = () => {
    const { currentProject } = useStore();
    const [deployStatus, setDeployStatus] = useState<'idle' | 'deploying' | 'success' | 'failed'>('idle');
    const [deploymentUrl, setDeploymentUrl] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);

    const handleDeploy = async () => {
        if (!currentProject) return;
        setDeployStatus('deploying');
        setLogs(prev => [...prev, 'Initiating deployment...']);

        try {
            const result = await DeployService.deployProject(currentProject.id);
            setLogs(prev => [...prev, `Deployment created: ${result.deploymentId}`]);
            setLogs(prev => [...prev, 'Building and deploying to Edge...']);

            // Simulate build time or wait for status update
            if (result.url) {
                setDeploymentUrl(result.url);
                setDeployStatus('success');
                setLogs(prev => [...prev, 'Deployment successful!']);
            } else {
                // If async, we would poll status here
                setDeployStatus('success'); // Assume success for demo
                setDeploymentUrl(`https://${currentProject.id}.insforge.app`);
            }
        } catch (error: any) {
            setDeployStatus('failed');
            setLogs(prev => [...prev, `Error: ${error.message}`]);
        }
    };

    return (
        <div className="flex flex-col h-full p-8 max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Deployment Center</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage your application builds and deployments.</p>
                </div>
                <button
                    onClick={handleDeploy}
                    disabled={deployStatus === 'deploying'}
                    className={clsx(
                        "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold shadow-lg transition-all active:scale-95",
                        deployStatus === 'deploying'
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/30"
                    )}
                >
                    {deployStatus === 'deploying' ? <Loader2 className="animate-spin" /> : <Rocket />}
                    <span>{deployStatus === 'deploying' ? 'Deploying...' : 'Deploy Now'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Status Card */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
                    <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                        <Package className="text-blue-500" /> Current Deployment
                    </h3>

                    {deployStatus === 'idle' && (
                        <div className="flex flex-col items-center justify-center h-48 text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950/50">
                            <Rocket size={32} className="mb-2 opacity-50" />
                            <p>No active deployment. Click "Deploy Now" to start.</p>
                        </div>
                    )}

                    {deployStatus !== 'idle' && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className={clsx(
                                    "w-16 h-16 rounded-2xl flex items-center justify-center shadow-inner",
                                    deployStatus === 'success' ? "bg-green-100 text-green-600" :
                                    deployStatus === 'failed' ? "bg-red-100 text-red-600" :
                                    "bg-blue-100 text-blue-600 animate-pulse"
                                )}>
                                    {deployStatus === 'success' ? <CheckCircle size={32} /> :
                                     deployStatus === 'failed' ? <AlertCircle size={32} /> :
                                     <Loader2 size={32} className="animate-spin" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg dark:text-white">
                                        {deployStatus === 'success' ? 'Deployed Successfully' :
                                         deployStatus === 'failed' ? 'Deployment Failed' :
                                         'Building Application...'}
                                    </h4>
                                    <p className="text-sm text-slate-500">
                                        Version v1.0.2 • {new Date().toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>

                            {deploymentUrl && (
                                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                                    <div>
                                        <label className="text-xs text-slate-400 uppercase font-bold">Live URL</label>
                                        <p className="font-mono text-blue-600 dark:text-blue-400">{deploymentUrl}</p>
                                    </div>
                                    <a href={deploymentUrl} target="_blank" rel="noreferrer" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
                                        <ExternalLink size={20} className="text-slate-500" />
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Logs Terminal */}
                <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs overflow-hidden flex flex-col h-[300px] lg:h-auto">
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800 text-slate-400">
                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="ml-2">Build Logs</span>
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1 text-slate-300">
                        {logs.length === 0 ? (
                            <span className="opacity-30">Waiting for logs...</span>
                        ) : (
                            logs.map((log, i) => (
                                <div key={i} className="break-all">
                                    <span className="text-slate-600 mr-2">{new Date().toLocaleTimeString()}</span>
                                    {log}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtifactsView;
