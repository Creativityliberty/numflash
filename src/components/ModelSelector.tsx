
import React from 'react';
import { GEMINI_MODELS } from '../data/models';
import { useStore } from '../store/useStore';
import { Sparkles, Check, DollarSign, Zap } from 'lucide-react';
import clsx from 'clsx';

const ModelSelector = () => {
  const { selectedModel, setSelectedModel } = useStore();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 overflow-y-auto max-h-[60vh]">
        {GEMINI_MODELS.map((model) => {
            const isSelected = selectedModel === model.id;
            return (
                <div
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
                    className={clsx(
                        "relative p-4 rounded-2xl border-2 transition-all cursor-pointer group hover:shadow-lg",
                        isSelected
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                    )}
                >
                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex gap-2">
                        {model.isNew && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-300 rounded-full uppercase tracking-wider">
                                New
                            </span>
                        )}
                        {model.isPaid && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-300 rounded-full uppercase tracking-wider">
                                Paid
                            </span>
                        )}
                    </div>

                    {/* Header */}
                    <div className="flex items-center gap-3 mb-3">
                        <div className={clsx(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                            isSelected ? "bg-blue-500 text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                        )}>
                            <Sparkles size={18} />
                        </div>
                        <div className="flex-1 pr-16">
                            <h3 className="font-bold text-sm text-slate-800 dark:text-white leading-tight">
                                {model.name}
                            </h3>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                                {model.id}
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-3 min-h-[48px]">
                        {model.description}
                    </p>

                    {/* Footer Info */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/50">
                         <div className="flex flex-col">
                             <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                 <Zap size={10} /> {model.context}
                             </span>
                             <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                                 <DollarSign size={10} /> In: {model.pricing.input} / Out: {model.pricing.output}
                             </span>
                         </div>

                         {isSelected && (
                             <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-in zoom-in">
                                 <Check size={14} className="text-white" />
                             </div>
                         )}
                    </div>
                </div>
            );
        })}
    </div>
  );
};

export default ModelSelector;
