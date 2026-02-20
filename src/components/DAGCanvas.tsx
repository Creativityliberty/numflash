
import React, { useEffect, useCallback, useMemo } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  Node,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { RealtimeHub } from '../server/services/realtime-hub';
import { useStore } from '../store/useStore';

const DAGCanvas = ({ projectId }: { projectId: string }) => {
  const { tasks, setTasks, updateTask } = useStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Transform tasks to nodes
  useEffect(() => {
      const newNodes: Node[] = tasks.map((t, index) => ({
          id: t.id,
          position: { x: 250, y: index * 100 + 50 }, // Simple vertical layout for now
          data: { label: t.title, status: t.status },
          style: {
              background: t.status === 'completed' ? '#dcfce7' : '#fff',
              border: t.status === 'running' ? '2px solid #3b82f6' : '1px solid #777',
              borderRadius: '8px',
              padding: '10px',
              width: 180
          }
      }));

      // Basic edges based on parent_id
      const newEdges: Edge[] = tasks
        .filter(t => t.parent_id)
        .map(t => ({
            id: `e${t.parent_id}-${t.id}`,
            source: t.parent_id!,
            target: t.id,
            type: 'smoothstep'
        }));

      setNodes(newNodes);
      setEdges(newEdges);
  }, [tasks, setNodes, setEdges]);

  // Realtime subscription
  useEffect(() => {
    if (!projectId) return;

    RealtimeHub.subscribeToProject(projectId, (payload) => {
      if (payload.type === 'task_updated') {
          updateTask(payload.id, payload.status);
      } else if (payload.type === 'workflow_created') {
          // Refresh tasks or append
          //Ideally fetchProjectData(projectId) again or append tasks
          // For now we assume useStore handles refetch or we dispatch an action
          // But here we can't easily refetch without passing the function.
          // Let's assume the payload contains the new tasks
          if (payload.tasks) {
              setTasks(payload.tasks);
          }
      }
    });
  }, [projectId, updateTask, setTasks]);

  return (
    <div style={{ width: '100%', height: '100%', background: '#f8fafc' }} className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background color="#cbd5e1" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default DAGCanvas;
