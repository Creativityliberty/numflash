
import React from 'react';
import DAGCanvas from '../components/DAGCanvas';
import { useStore } from '../store/useStore';
import { Cpu } from 'lucide-react';

const DAGView = () => {
  const { currentProject } = useStore();

  if (!currentProject) {
      return (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Cpu size={48} className="mb-4 opacity-50" />
              <p>Select or create a project to view the DAG.</p>
          </div>
      );
  }

  return (
    <div className="h-full w-full bg-slate-50 dark:bg-slate-900 transition-colors duration-500 p-4">
      <h2 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">Execution Graph</h2>
      <div className="h-[calc(100%-2rem)] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
        <DAGCanvas projectId={currentProject.id} />
      </div>
    </div>
  );
};

export default DAGView;
