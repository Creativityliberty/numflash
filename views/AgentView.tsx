
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Message, AppState, AIActionResponse } from '../types';

interface AgentViewProps {
  state: AppState;
  updateState: (patch: Partial<AppState>) => void;
}

const AgentView: React.FC<AgentViewProps> = ({ state, updateState }) => {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [state.messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: input };
    const newMessages = [...state.messages, userMsg];
    updateState({ messages: newMessages });
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: input,
        config: {
          systemInstruction: `Tu es l'agent Nümflash. Tu aides le 'Chef' à gérer son projet. 
          IMPORTANT: Tu dois TOUJOURS répondre au format JSON. 
          Ne jamais utiliser de markdown, de gras (**) ou d'astérisques dans le texte. 
          Reste pro et concis. Si l'utilisateur demande d'ajouter une tâche ou un fichier, spécifie l'action et le payload.`,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              message: { type: Type.STRING, description: "La réponse textuelle propre pour le Chef." },
              action: { 
                type: Type.STRING, 
                enum: ['add_task', 'add_file', 'deploy', 'none'],
                description: "L'action technique à effectuer sur l'UI."
              },
              payload: {
                type: Type.OBJECT,
                description: "Données nécessaires pour l'action (ex: {text: 'ma tache'} ou {name: 'app.ts', content: '...'})"
              }
            },
            required: ["message", "action"]
          }
        }
      });

      const aiData: AIActionResponse = JSON.parse(response.text);
      const aiMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        sender: 'ai', 
        text: aiData.message
      };

      // Traitement des actions IA
      let updatedTasks = [...state.tasks];
      let updatedFiles = [...state.files];

      if (aiData.action === 'add_task' && aiData.payload?.text) {
        updatedTasks.push({ id: Date.now().toString(), text: aiData.payload.text, completed: false });
      } else if (aiData.action === 'add_file' && aiData.payload?.name) {
        updatedFiles.push({ 
          id: Date.now().toString(), 
          name: aiData.payload.name, 
          icon: 'description', 
          color: 'text-blue-400', 
          content: aiData.payload.content || '' 
        });
      } else if (aiData.action === 'deploy') {
        aiMsg.status = 'deploying';
        setTimeout(() => {
          updateState({ 
            messages: [...newMessages, { ...aiMsg, status: 'success' }] 
          });
        }, 3000);
        updateState({ messages: [...newMessages, aiMsg] });
        setIsTyping(false);
        return;
      }

      updateState({ 
        messages: [...newMessages, aiMsg],
        tasks: updatedTasks,
        files: updatedFiles
      });
    } catch (err) {
      console.error(err);
      updateState({ 
        messages: [...newMessages, { id: 'err', sender: 'ai', text: "Désolé Chef, une erreur dans mon cerveau JSON." }] 
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center bg-background-light dark:bg-background-dark p-6 transition-colors duration-500">
      <div className="text-center mb-8 mt-12 space-y-2 max-w-2xl">
        <h2 className="text-4xl font-bold tracking-tight text-slate-800 dark:text-white">What will you build?</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Orchestrate your workspace with Nümflash AI Agent.</p>
      </div>

      <div ref={scrollRef} className="flex-1 w-full max-w-3xl overflow-y-auto space-y-6 px-4 no-scrollbar pb-12">
        {state.messages.map((m) => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] space-y-2 ${m.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`p-4 rounded-2xl text-sm shadow-sm transition-all ${
                m.sender === 'ai' 
                  ? 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-border-light dark:border-slate-800' 
                  : 'bg-teal-600 text-white shadow-glow'
              }`}>
                {m.text}
              </div>
              {m.status === 'deploying' && (
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 animate-pulse">
                  <span className="material-symbols-outlined text-sm spin text-teal-500">sync</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Deploying...</span>
                </div>
              )}
              {m.status === 'success' && (
                <div className="flex items-center gap-3 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <span className="material-symbols-outlined text-sm text-emerald-500">check_circle</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Deployed</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-900 border border-border-light dark:border-slate-800 p-4 rounded-2xl flex gap-1">
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl mb-8 relative px-4">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-indigo-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-border-light dark:border-slate-800 p-2 flex items-center">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4 text-slate-800 dark:text-white placeholder-slate-400" 
              placeholder="Ex: 'Ajoute la tâche: Tester le paiement'" 
              type="text"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping}
              className="w-10 h-10 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white rounded-xl flex items-center justify-center shadow-lg transition-all active:scale-90"
            >
              <span className="material-symbols-outlined text-lg">arrow_upward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentView;
