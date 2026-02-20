
import React, { useEffect, useCallback } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { insforge } from '../lib/insforge';
import { useStore } from '../store/useStore';
import { Cpu } from 'lucide-react';

const DAGView = () => {
  const { currentProject, tasks, updateTask, setTasks } = useStore();

  if (!currentProject) {
      return (
          <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors p-8 text-center">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Cpu size={48} className="text-slate-400 dark:text-slate-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No Project Selected</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-md">
                  Please create a new project or select an existing one from the AI Architect view to visualize the execution graph.
              </p>
          </div>
      );
  }

  // Transform tasks into nodes/edges for ReactFlow
  const initialNodes = tasks.map((task, index) => ({
    id: task.id,
    type: 'default', // Can use custom node types later
    data: { label: task.title, status: task.status },
    position: { x: 250 * (task.depth || 0) + (index % 2) * 50, y: index * 100 },
    style: {
        background: task.status === 'completed' ? '#dcfce7' : task.status === 'running' ? '#dbeafe' : '#f1f5f9',
        border: '1px solid #94a3b8',
        borderRadius: '12px',
        padding: '10px',
        width: 180
    }
  }));

  const initialEdges = tasks
    .filter(t => t.parent_id)
    .map(t => ({
      id: `e${t.parent_id}-${t.id}`,
      source: t.parent_id!,
      target: t.id,
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#64748b' }
    }));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync when store updates
  useEffect(() => {
      setNodes(tasks.map((task, index) => ({
        id: task.id,
        type: 'default',
        data: { label: task.title, status: task.status },
        position: { x: 250 * (task.depth || 0) + (index % 2) * 50, y: index * 100 },
        style: {
            background: task.status === 'completed' ? '#dcfce7' : task.status === 'running' ? '#dbeafe' : '#f1f5f9',
            border: task.status === 'running' ? '2px solid #3b82f6' : '1px solid #94a3b8',
            borderRadius: '12px',
            padding: '10px',
            width: 180
        }
      })));

      setEdges(tasks.filter(t => t.parent_id).map(t => ({
          id: `e${t.parent_id}-${t.id}`,
          source: t.parent_id!,
          target: t.id,
          animated: true,
          markerEnd: { type: MarkerType.ArrowClosed },
          style: { stroke: '#64748b' }
      })));
  }, [tasks, setNodes, setEdges]);

  // Realtime subscription setup
  useEffect(() => {
    const setupRealtime = async () => {
      if (!currentProject) return;

      await insforge.realtime.connect();
      const channel = `project:${currentProject.id}`;
      await insforge.realtime.subscribe(channel);

      insforge.realtime.on('task_updated', (payload: any) => {
        updateTask(payload.id, payload.status);
      });

      insforge.realtime.on('workflow_created', (payload: any) => {
        if (payload.tasks) {
            setTasks(payload.tasks);
        }
      });
    };

    setupRealtime();
    return () => { insforge.realtime.disconnect(); };
  }, [currentProject, updateTask]);

  return (
    <div className="h-full w-full bg-slate-50 dark:bg-slate-900 transition-colors duration-500">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-right"
      >
        <Background color="#cbd5e1" gap={20} />
        <Controls className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl shadow-sm" />
      </ReactFlow>
    </div>
  );
};

export default DAGView;
