
import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { ChefAgent } from '../server/agents/chef-agent';
import { TemplateService } from '../server/services/template-service';
import { PROJECT_TEMPLATES } from '../data/templates';
import { Send, Bot, User, Cpu, Settings2, X, Box } from 'lucide-react';
import clsx from 'clsx';
import ModelSelector from '../components/ModelSelector';
import VoiceInput from '../components/VoiceInput';
import { GEMINI_MODELS } from '../data/models';

const BuilderView = () => {
  const { messages, addMessage, currentProject, selectedModel } = useStore();
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(messages.length === 0);

  const activeModel = GEMINI_MODELS.find(m => m.id === selectedModel);

  const handleTemplateSelect = async (templateId: string) => {
      if (!currentProject) return;

      setIsProcessing(true);
      setShowTemplateSelector(false);
      addMessage({ role: 'user', content: `Start with template: ${templateId}`, timestamp: new Date() });

      try {
          await TemplateService.applyTemplate(currentProject.id, templateId);
          addMessage({
              role: 'system',
              content: `Template ${templateId} applied successfully. You can now customize it or deploy.`,
              timestamp: new Date()
          });
      } catch (e: any) {
          addMessage({ role: 'system', content: `Error applying template: ${e.message}`, isError: true });
      } finally {
          setIsProcessing(false);
      }
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim() || !currentProject) return;

    const userMsg = { role: 'user', content: textToSend, timestamp: new Date() };
    addMessage(userMsg);
    setInput("");
    setIsProcessing(true);
    setShowTemplateSelector(false);

    try {
       await ChefAgent.createWorkflow(currentProject.id, textToSend, selectedModel);

       addMessage({
           role: 'system',
           content: "J'ai analysé votre demande. Le plan d'exécution a été généré et les tâches sont en cours de création dans la vue DAG.",
           timestamp: new Date()
       });

    } catch (error: any) {
        addMessage({ role: 'system', content: `Erreur: ${error.message}`, isError: true, timestamp: new Date() });
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 relative">

       {/* Model Selector Header */}
       <div className="flex justify-between items-center mb-4">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                onClick={() => setShowModelSelector(!showModelSelector)}>
                <Bot size={14} className="text-blue-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {activeModel ? activeModel.name : selectedModel}
                </span>
                <Settings2 size={12} className="text-slate-400 ml-1" />
           </div>
       </div>

       {/* Model Selector Overlay */}
       {showModelSelector && (
           <div className="absolute inset-x-4 top-14 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl animate-in slide-in-from-top-4 fade-in duration-200 max-h-[70vh] flex flex-col">
               <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                   <h3 className="font-bold text-slate-800 dark:text-white">Select AI Model</h3>
                   <button onClick={() => setShowModelSelector(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                       <X size={18} />
                   </button>
               </div>
               <ModelSelector />
           </div>
       )}

       <div className="flex-1 overflow-y-auto space-y-6 pb-4 scroll-smooth">
          {/* Template Selector Card */}
          {showTemplateSelector && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 animate-in fade-in zoom-in duration-300">
                  <div
                    onClick={() => setShowTemplateSelector(false)}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 cursor-pointer flex flex-col items-center justify-center text-center gap-2 group transition-all"
                  >
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                          <Bot size={24} className="text-slate-500 dark:text-slate-400 group-hover:text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-slate-700 dark:text-slate-200">Start from Blank</h3>
                      <p className="text-xs text-slate-500">Let AI build everything from scratch</p>
                  </div>

                  {PROJECT_TEMPLATES.map(template => (
                      <div
                        key={template.id}
                        onClick={() => handleTemplateSelect(template.id)}
                        className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-lg cursor-pointer flex flex-col gap-2 transition-all relative overflow-hidden group"
                      >
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-2">
                              <Box size={20} className="text-indigo-600 dark:text-indigo-400" />
                          </div>
                          <h3 className="font-semibold text-slate-800 dark:text-white">{template.name}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{template.description}</p>
                          <div className="mt-2 flex gap-2">
                              {template.tags.map(tag => (
                                  <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                                      {tag}
                                  </span>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          )}

          {messages.length === 0 && !showTemplateSelector && (
              <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                  <Cpu size={48} className="mb-4 opacity-50" />
                  <p>Describe your feature or request...</p>
              </div>
          )}

          {messages.map((msg, idx) => (
             <div key={idx} className={clsx(
                 "flex gap-4 p-4 rounded-2xl max-w-[85%]",
                 msg.role === 'user'
                    ? "bg-blue-600 text-white self-end ml-auto rounded-tr-none"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 self-start mr-auto rounded-tl-none shadow-sm"
             )}>
                 <div className={clsx(
                     "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                     msg.role === 'user' ? "bg-blue-500" : "bg-teal-500"
                 )}>
                     {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                 </div>
                 <div className="flex-1">
                     <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                     <span className="text-[10px] opacity-70 mt-2 block">
                         {msg.timestamp?.toLocaleTimeString()}
                     </span>
                 </div>
             </div>
          ))}

          {isProcessing && (
              <div className="flex gap-4 p-4 self-start">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center animate-pulse">
                      <Bot size={16} className="text-white" />
                  </div>
                  <div className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
              </div>
          )}
       </div>

       <div className="mt-4 relative flex items-center gap-2">
           <div className="relative flex-1">
               <input
                 type="text"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                 placeholder="Décrivez une nouvelle fonctionnalité..."
                 className="w-full pl-6 pr-12 py-4 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 outline-none shadow-lg transition-all"
               />
               <button
                 onClick={() => handleSend()}
                 disabled={!input.trim() || isProcessing}
                 className="absolute right-2 top-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white rounded-full transition-colors w-10 h-10 flex items-center justify-center"
               >
                   <Send size={18} />
               </button>
           </div>

           <VoiceInput
                onTranscript={(text) => handleSend(text)}
                isProcessing={isProcessing}
           />
       </div>
    </div>
  );
};

export default BuilderView;
