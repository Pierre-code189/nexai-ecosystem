'use client';

import React, { useState } from 'react';
import { GeneratedWebsite } from '@/types/builder';
import { FileText, Save, Check, Copy } from 'lucide-react';

interface ReadmeViewerProps {
  website: GeneratedWebsite;
  onUpdateReadme: (newReadme: string) => void;
}

export const ReadmeViewer: React.FC<ReadmeViewerProps> = ({ website, onUpdateReadme }) => {
  const [content, setContent] = useState(website.readmeContent || '');
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onUpdateReadme(content);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-xs">
      <div className="p-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-200 font-bold">
          <FileText className="w-4 h-4 text-blue-400" />
          <span>README.md (Memoria del Proyecto)</span>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1 text-[11px]"
            title="Copiar Markdown"
          >
            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'Copiado' : 'Copiar'}</span>
          </button>
          <button
            onClick={handleSave}
            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors flex items-center gap-1 text-[11px] shadow"
          >
            {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? 'Guardado' : 'Guardar'}</span>
          </button>
        </div>
      </div>

      <div className="p-2 text-[10px] text-slate-400 bg-slate-950/60 border-b border-slate-800/80 px-4">
        ✨ Este documento contiene las directivas que la IA lee para saber qué crear y cómo evolucionar tu software.
      </div>

      <div className="flex-1 p-3 overflow-hidden flex flex-col">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 w-full p-3 font-mono text-[11px] leading-relaxed bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
        />
      </div>
    </div>
  );
};
