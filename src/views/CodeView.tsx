
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FileService } from '../server/services/file-service';
import { useStore } from '../store/useStore';
import { FileCode, Folder, ChevronRight, ChevronDown, Cpu } from 'lucide-react';
import clsx from 'clsx';
import { insforge } from '../lib/insforge';

const CodeView = () => {
  const { files, currentProject, addFile } = useStore();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [code, setCode] = useState("// Select a file to view code");
  const [loading, setLoading] = useState(false);

  // Realtime file updates
  useEffect(() => {
    if (!currentProject) return;

    const channel = `project:${currentProject.id}`;
    const handleFileCreated = (payload: any) => {
        // Optimistically add file to store if not present
        // Payload expected: { path, storage_key, storage_url, id }
        // We might need to fetch details or just structure it manually
        // For now, let's assume we fetch full file list on update or have enough info
        // Ideally we'd get the full file record.
        // Let's assume FileService.getProjectFiles is fast enough or payload has it.
        if (payload.path) {
           // We might need to refetch files list to be safe, or just add a partial record
           // Simple approach: Add if path doesn't exist
           addFile({
               id: payload.id || Math.random().toString(), // Mock ID if missing
               project_id: currentProject.id,
               path: payload.path,
               storage_key: payload.storage_key || '',
               storage_url: payload.storage_url || ''
           });
        }
    };

    insforge.realtime.on('file_created', handleFileCreated);

    return () => {
        // Cleanup
    };
  }, [currentProject, addFile]);

  useEffect(() => {
    if (selectedFile && currentProject) {
      const fileNode = files.find(f => f.path === selectedFile);
      if (fileNode) {
        setLoading(true);
        FileService.getFileContent(fileNode.storage_key)
          .then(content => {
             setCode(content);
             setLoading(false);
          })
          .catch(err => {
             console.error(err);
             setCode("// Error loading file");
             setLoading(false);
          });
      }
    }
  }, [selectedFile, files, currentProject]);

  if (!currentProject) {
      return (
          <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors p-8 text-center">
              <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Cpu size={48} className="text-slate-400 dark:text-slate-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No Project Selected</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-md">
                  Code explorer requires an active project context. Please start by creating or selecting a project.
              </p>
          </div>
      );
  }

  return (
    <div className="flex h-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      {/* File Tree Sidebar */}
      <div className="w-64 border-r border-slate-200 dark:border-slate-800 p-4 overflow-y-auto">
        <h3 className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Project Files</h3>
        <div className="space-y-1">
          {files.map(file => (
            <div
              key={file.id}
              onClick={() => setSelectedFile(file.path)}
              className={clsx(
                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors text-sm",
                selectedFile === file.path
                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <FileCode size={16} />
              <span className="truncate">{file.path.split('/').pop()}</span>
            </div>
          ))}
          {files.length === 0 && (
             <p className="text-xs text-slate-400 italic px-2">No files generated yet.</p>
          )}
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 relative">
         {loading && (
             <div className="absolute inset-0 z-10 bg-white/50 dark:bg-slate-900/50 flex items-center justify-center">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
             </div>
         )}
         <Editor
           height="100%"
           defaultLanguage="typescript"
           theme="vs-dark" // Could make dynamic based on AppState darkMode
           value={code}
           options={{
             minimap: { enabled: false },
             fontSize: 14,
             scrollBeyondLastLine: false,
             automaticLayout: true,
             padding: { top: 20 }
           }}
         />
      </div>
    </div>
  );
};

export default CodeView;
