
import React, { useState, useEffect } from 'react';
import { Save, Key, Globe, Lock } from 'lucide-react';

const SettingsView = () => {
  const [insforgeUrl, setInsforgeUrl] = useState('');
  const [insforgeKey, setInsforgeKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');

  useEffect(() => {
    setInsforgeUrl(localStorage.getItem('VITE_INSFORGE_URL') || '');
    setInsforgeKey(localStorage.getItem('VITE_INSFORGE_API_KEY') || '');
    setOpenaiKey(localStorage.getItem('OPENAI_API_KEY') || '');
    setGeminiKey(localStorage.getItem('GEMINI_API_KEY') || '');
  }, []);

  const handleSave = () => {
    localStorage.setItem('VITE_INSFORGE_URL', insforgeUrl);
    localStorage.setItem('VITE_INSFORGE_API_KEY', insforgeKey);
    localStorage.setItem('OPENAI_API_KEY', openaiKey);
    localStorage.setItem('GEMINI_API_KEY', geminiKey);

    // Force reload to apply InsForge connection changes
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white flex items-center gap-2">
        <SettingsIcon className="w-8 h-8 text-slate-500" />
        Configuration
      </h2>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-8">

        {/* InsForge Config */}
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Globe size={20} />
            InsForge Connection
          </h3>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Project URL</label>
              <input
                type="text"
                value={insforgeUrl}
                onChange={(e) => setInsforgeUrl(e.target.value)}
                placeholder="https://your-project.region.insforge.app"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Anon Key</label>
              <div className="relative">
                <input
                  type="password"
                  value={insforgeKey}
                  onChange={(e) => setInsforgeKey(e.target.value)}
                  placeholder="ik_..."
                  className="w-full p-3 pl-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
                <Key size={16} className="absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-slate-200 dark:border-slate-700"></div>

        {/* AI Models Config */}
        <section>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <BotIcon className="w-5 h-5" />
            AI Models (Optional)
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            These keys are sent securely to the backend for generating code and plans.
          </p>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">OpenAI API Key</label>
              <div className="relative">
                <input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full p-3 pl-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
                <Lock size={16} className="absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Gemini API Key</label>
              <div className="relative">
                <input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full p-3 pl-10 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                />
                <Lock size={16} className="absolute left-3 top-3.5 text-slate-400" />
              </div>
            </div>
          </div>
        </section>

        <button
          onClick={handleSave}
          className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          <Save size={20} />
          Save & Reload
        </button>
      </div>
    </div>
  );
};

// Icons components locally to avoid missing imports if lucide-react versions differ
const SettingsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);

const BotIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
);

export default SettingsView;
