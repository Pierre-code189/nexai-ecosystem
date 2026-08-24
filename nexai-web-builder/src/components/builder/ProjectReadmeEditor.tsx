'use client';

import React, { useState } from 'react';
import { GeneratedWebsite } from '@/types/builder';
import { FileText, Save, Check, Sparkles, BookOpen } from 'lucide-react';

interface ProjectReadmeEditorProps {
  website: GeneratedWebsite;
  onUpdateWebsite: (updated: GeneratedWebsite) => void;
}

export const ProjectReadmeEditor: React.FC<ProjectReadmeEditorProps> = ({ website, onUpdateWebsite }) => {
  const defaultReadme = website.readmeContent || `# 🚀 ${website.businessName}

## 🎯 1. Visión y Propósito
${website.hero.subtitle || 'Sitio web comercial interactivo diseñado para captar clientes y procesar pedidos.'}

## 🏗️ 2. Arquitectura de Módulos
- **Rubro:** ${website.detectedIndustry}
- **Diseño:** Modo Oscuro / Claro con Paleta (${website.theme.primaryColor})
- **Productos / Catálogo Activo:** ${website.services.length} items registrados.
- **Carrito de Compras:** ${website.hasCart ? 'Activo' : 'Inactivo'}
- **Mapa Interactivo:** ${website.map?.enabled ? 'Activo (Piura, Perú)' : 'Opcional'}

## 📝 3. Registro de Cambios de la IA (Changelog)
- **v1.0.0:** Generación de arquitectura inicial en React 18 + Vite + Tailwind.
- **v1.1.0:** Configuración de pasarela de WhatsApp y catálogo de productos en Soles (PEN).
`;

  const [content, setContent] = useState(defaultReadme);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onUpdateWebsite({
      ...website,
      readmeContent: content,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800 text-xs">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          <div>
            <span className="font-bold text-slate-100 block text-xs">Memoria del Proyecto (README.md)</span>
            <span className="text-[10px] text-slate-400">Instrucciones y especificaciones que la IA sigue</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold flex items-center gap-1 shadow"
        >
          {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          <span>{isSaved ? '¡Guardado!' : 'Guardar'}</span>
        </button>
      </div>

      <div className="flex-1 p-3 flex flex-col">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-[11px] leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Edita las reglas e instrucciones de tu proyecto..."
        />
        <div className="pt-2 text-[10px] text-slate-500 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>La IA lee este README para mantener coherencia en cada modificación.</span>
        </div>
      </div>
    </div>
  );
};
