'use client';

import React, { useState, useEffect } from 'react';
import { GeneratedWebsite } from '@/types/builder';
import { FileText, Save, Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProjectReadmeTabProps {
  website: GeneratedWebsite;
  onUpdateWebsite: (updated: GeneratedWebsite) => void;
}

export const ProjectReadmeTab: React.FC<ProjectReadmeTabProps> = ({ website, onUpdateWebsite }) => {
  const defaultReadme = `# 🚀 ${website.businessName || 'Mi Proyecto'} — Especificación del Proyecto\n\n## 🎯 1. Visión y Objetivo\nSitio web y plataforma comercial para ${website.businessName || 'la empresa'}.\n\n## 📐 2. Componentes & Funcionalidades Activas\n- [x] **Hero Persuasivo** con botón a WhatsApp\n- [x] **Catálogo Dinámico** con precios en Soles (S/)\n- [x] **Carrito de Compras** y checkout interactivo\n- [x] **Formulario de Contacto** conectado al CRM\n\n## 🎨 3. Reglas de Diseño\n- **Color Primario:** ${website.theme?.primaryColor || '#3b82f6'}\n- **Color Secundario:** ${website.theme?.secondaryColor || '#1d4ed8'}\n- **Modo:** Oscuro / Claro interactivo\n\n## 📝 4. Changelog de la IA\n- **v1.0.0:** Creación inicial del proyecto.`;

  const [content, setContent] = useState<string>(
    website.readmeMarkdown || website.readmeContent || defaultReadme
  );
  const [isSaved, setIsSaved] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (website.readmeMarkdown || website.readmeContent) {
      setContent(website.readmeMarkdown || website.readmeContent || defaultReadme);
    }
  }, [website.readmeMarkdown, website.readmeContent]);

  const handleSave = () => {
    onUpdateWebsite({
      ...website,
      readmeMarkdown: content,
      readmeContent: content,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-xs">
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-400" />
          <div>
            <span className="font-bold text-slate-100 block text-xs">README.md del Proyecto</span>
            <span className="text-[10px] text-slate-400">Memoria de especificaciones de la IA</span>
          </div>
        </div>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm" onClick={handleCopy} leftIcon={isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}>
            {isCopied ? '¡Copiado!' : 'Copiar'}
          </Button>
          <Button size="sm" onClick={handleSave} leftIcon={isSaved ? <Check className="w-3 h-3" /> : <Save className="w-3 h-3" />}>
            {isSaved ? '¡Guardado!' : 'Guardar'}
          </Button>
        </div>
      </div>

      <div className="flex-1 p-3 flex flex-col space-y-2">
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Este archivo define las directivas y memoria de tu proyecto. La IA lo actualiza automáticamente con cada cambio.
        </p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 w-full p-3 font-mono text-[11px] bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed"
          placeholder="Especificaciones en Markdown..."
        />
      </div>
    </div>
  );
};
