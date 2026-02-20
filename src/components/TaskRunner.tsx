
import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { WorkerAgent } from '../server/agents/worker-agent';
import { insforge } from '../lib/insforge';

const MAX_CONCURRENT_TASKS = 2;

const TaskRunner: React.FC = () => {
  const { currentProject, tasks, updateTask } = useStore();
  const [runningCount, setRunningCount] = useState(0);

  useEffect(() => {
    if (!currentProject) return;

    const pendingTasks = tasks.filter(t => t.status === 'pending');
    const runningTasks = tasks.filter(t => t.status === 'running');

    // Sync local running count with store state (in case of page reload or desync)
    // But we want to control execution here.

    if (pendingTasks.length > 0 && runningTasks.length < MAX_CONCURRENT_TASKS) {
        const nextTask = pendingTasks[0];

        // Mark as running locally and in DB
        const startTask = async () => {
            try {
                // Optimistic update
                updateTask(nextTask.id, 'running');

                // Update DB
                await insforge.database
                    .from('tasks')
                    .update({ status: 'running' })
                    .eq('id', nextTask.id);

                // Execute Agent
                await WorkerAgent.executeCodingTask(
                    currentProject.id,
                    nextTask,
                    'gemini-3-pro-preview', // Default model
                    (chunk) => {
                        // Optional: Handle streaming chunks if we implement that
                    }
                );

                // Success handled by Realtime (task_updated -> completed) or Agent Worker

            } catch (e) {
                console.error("Task execution failed", e);
                updateTask(nextTask.id, 'failed');
                await insforge.database.from('tasks').update({ status: 'failed' }).eq('id', nextTask.id);
            }
        };

        startTask();
    }
  }, [tasks, currentProject, updateTask]);

  return null; // Invisible component
};

export default TaskRunner;
