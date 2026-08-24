'use client';

import React, { useState } from 'react';
import { GeneratedWebsite } from '@/types/builder';
import { FileCode, Save, Check, Sparkles, BookOpen, Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ProjectSpecTabProps {
  website: GeneratedWebsite;
  onUpdateWebsite: (updated: GeneratedWebsite) => void;
}

export const ProjectSpecTab: React.FC<ProjectSpecTabProps> = ({ website, onUpdateWebsite }) => {
  const defaultReadme = `# 🚀 Especificación del Proyecto: ${website.businessName}

## 🎯 1. Visión y Objetivo
- **Negocio:** ${website.businessName}
- **Eslogan:** ${website.tagline}
- **Rubro:** ${website.detectedIndustry}
- **Contacto:** ${website.phoneNumber} | ${website.email}

## 📐 2. Módulos & Funcionalidades
- [x] Hero Comercial con CTA a WhatsApp
- [x] Catálogo con ${website.services.length} productos y precios en Soles
- [x] Carrito de Compras interactivo
- [x] Formulario de Pedidos conectado al CRM

## 🎨 3. Reglas de Diseño
- **Color Primario:** ${website.theme.primaryColor || '#ea580c'}
- **Color Secundario:** ${website.theme.secondaryColor || '#9a3412'}

## 📝 4. Registro de Cambios (Changelog de la IA)
- **v1.0.0:** Generación inicial del sitio web a partir del prompt.`;

  const [readme, setReadme] = useState(website.readmeContent || defaultReadme);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    onUpdateWebsite({ ...website, readmeContent: readme });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800 text-xs">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-bold text-slate-100 block text-xs">Memoria README.md</span>
            <span className="text-[10px] text-slate-400">Especificación viva del proyecto</span>
          </div>
        </div>
        <Button size="sm" onClick={handleSave} leftIcon={isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}>
          {isSaved ? '¡Guardado!' : 'Guardar'}
        </Button>
      </div>

      <div className="flex-1 p-3.5 space-y-3 flex flex-col">
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Este archivo define las reglas, arquitectura y changelog que el <strong>Agente de IA</strong> consulta antes de aplicar modificaciones.
        </p>
        <textarea
          value={readme}
          onChange={(e) => setReadme(e.target.value)}
          rows={18}
          className="flex-1 w-full p-3 font-mono text-[11px] bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed resize-none"
        />
      </div>
    </div>
  );
};
