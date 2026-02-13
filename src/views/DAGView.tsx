
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

const DAGView = () => {
  const { currentProject, tasks, updateTask } = useStore();

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
