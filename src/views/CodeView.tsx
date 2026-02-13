
import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { FileService } from '../server/services/file-service';
import { useStore } from '../store/useStore';
import { FileCode, Folder, ChevronRight, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

const CodeView = () => {
  const { files, currentProject } = useStore();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [code, setCode] = useState("// Select a file to view code");
  const [loading, setLoading] = useState(false);

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
