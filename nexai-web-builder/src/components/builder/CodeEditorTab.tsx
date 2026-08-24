'use client';

import React, { useState } from 'react';
import { Code2, Copy, Check, Play, FileCode, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CodeEditorTabProps {
  jsxCode: string;
  onUpdateCode: (newCode: string) => void;
}

export const CodeEditorTab: React.FC<CodeEditorTabProps> = ({ jsxCode, onUpdateCode }) => {
  const [codeDraft, setCodeDraft] = useState(jsxCode);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    onUpdateCode(codeDraft);
    setApplied(true);
    setTimeout(() => setApplied(false), 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-950 text-xs space-y-3 p-4 select-none">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-slate-100 text-xs">Código React 18 (App.jsx)</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleCopy} leftIcon={copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}>
            {copied ? 'Copiado' : 'Copiar'}
          </Button>
          <Button size="sm" onClick={handleApply} leftIcon={<Play className="w-3 h-3 text-emerald-400" />}>
            {applied ? '¡Ejecutado!' : 'Ejecutar Cambios'}
          </Button>
        </div>
      </div>

      <p className="text-[11px] text-slate-400">
        Código fuente generado por el Agente <strong>Apio</strong>. Puedes modificarlo directamente y ejecutarlo en el Sandbox en caliente.
      </p>

      <textarea
        value={codeDraft}
        onChange={(e) => setCodeDraft(e.target.value)}
        rows={25}
        spellCheck={false}
        className="flex-1 w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl font-mono text-xs text-blue-300 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none selection:bg-blue-600 selection:text-white"
      />
    </div>
  );
};
