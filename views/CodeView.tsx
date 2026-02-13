
import React, { useState } from 'react';

const CodeView: React.FC = () => {
  const [activeFile, setActiveFile] = useState('CartController.ts');

  const files = [
    { name: 'CartController.ts', icon: 'description', color: 'text-blue-400' },
    { name: 'AuthController.ts', icon: 'description', color: 'text-blue-400' },
    { name: 'package.json', icon: 'description', color: 'text-yellow-500' },
  ];

  const codeSnippet = `import { Request, Response } from 'express';
import { CartService } from '../services/CartService';

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  public addItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const { productId, quantity } = req.body;
      const userId = req.user?.id;

      if (!productId || quantity <= 0) {
        res.status(400).json({ error: 'Invalid product or quantity' });
        return;
      }

      const updatedCart = await this.cartService.addToCart(userId, productId, quantity);
      res.status(200).json(updatedCart);
    } catch (error) {
      console.error('Add to cart failed', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}`;

  return (
    <div className="h-full bg-surface-variant-light dark:bg-surface-variant-dark p-2 flex gap-2 overflow-hidden transition-colors">
      <aside className="w-64 flex flex-col bg-surface-light dark:bg-surface-dark rounded-2xl border border-white/50 dark:border-white/5 shadow-elevation-1 overflow-hidden shrink-0">
        <div className="p-4 border-b border-border-light dark:border-border-dark flex items-center justify-between shrink-0">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Explorer</h3>
          <div className="flex gap-1">
            <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition"><span className="material-icons-round text-sm text-slate-500">note_add</span></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 text-sm font-medium text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
            <span className="material-icons-round text-slate-400 text-sm transform rotate-90">chevron_right</span>
            <span className="material-icons-round text-amber-400 text-base">folder</span>
            <span>src</span>
          </div>
          <div className="pl-4">
            {files.map(f => (
              <div 
                key={f.name}
                onClick={() => setActiveFile(f.name)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  activeFile === f.name ? 'bg-primary/10 dark:bg-primary/20 text-primary font-bold' : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span className={`material-icons-round ${f.color} text-base`}>{f.icon}</span>
                <span className="truncate">{f.name}</span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <section className="flex-1 flex flex-col gap-2 overflow-hidden h-full">
        <div className="flex-1 flex flex-col bg-white dark:bg-editor-bg rounded-2xl shadow-elevation-1 border border-white/50 dark:border-white/5 overflow-hidden relative">
          <div className="h-10 flex bg-slate-50 dark:bg-editor-sidebar border-b border-border-light dark:border-black/40">
            {files.map(f => (
              <div 
                key={f.name}
                onClick={() => setActiveFile(f.name)}
                className={`flex items-center min-w-[140px] px-4 text-xs font-medium cursor-pointer transition-colors select-none ${
                  activeFile === f.name ? 'bg-white dark:bg-editor-bg border-t-2 border-primary text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'
                }`}
              >
                <span className={`material-icons-round ${f.color} text-sm mr-2`}>description</span>
                <span className="truncate">{f.name}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 overflow-auto p-4 font-mono text-sm leading-6 relative text-slate-800 dark:text-editor-fg scroll-smooth">
            <pre className="whitespace-pre-wrap">
              {codeSnippet.split('\n').map((line, i) => (
                <div key={i} className="flex group hover:bg-slate-100 dark:hover:bg-editor-active-line">
                  <span className="w-10 text-right pr-4 text-slate-300 dark:text-slate-600 select-none text-xs">{i + 1}</span>
                  <span>{line}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>

        <div className="h-40 bg-white dark:bg-surface-dark rounded-2xl shadow-elevation-1 border border-white/50 dark:border-white/5 flex flex-col overflow-hidden shrink-0 transition-colors">
          <div className="h-10 px-4 bg-slate-50 dark:bg-editor-sidebar flex items-center justify-between border-b border-border-light dark:border-white/5">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 border-b-2 border-primary py-2 text-xs font-medium text-slate-800 dark:text-white">
                <span className="material-icons-round text-sm">terminal</span>
                Terminal
              </div>
            </div>
          </div>
          <div className="flex-1 bg-black/90 dark:bg-[#121212] p-3 font-mono text-[11px] overflow-y-auto">
            <div className="text-slate-400 mb-1">$ npm run dev</div>
            <div className="text-slate-300">&gt; ecommerce-backend@1.0.0 dev</div>
            <div className="flex items-center gap-2 text-green-400 mt-1">
              <span>✔</span>
              <span>Server running on port 3000</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CodeView;
