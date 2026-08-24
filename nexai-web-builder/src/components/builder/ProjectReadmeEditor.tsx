'use client';

import React from 'react';
import { GeneratedWebsite } from '@/types/builder';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { FileCode, Save } from 'lucide-react';

interface ProjectReadmeEditorProps {
  website: GeneratedWebsite;
  readmeText: string;
  onChangeReadme: (val: string) => void;
}

export const ProjectReadmeEditor: React.FC<ProjectReadmeEditorProps> = ({
  website,
  readmeText,
  onChangeReadme,
}) => {
  return (
    <Card className="h-full flex flex-col border-slate-800 bg-slate-900 shadow-xl">
      <CardHeader className="py-3 px-4 border-b border-slate-800 flex items-center justify-between">
        <CardTitle className="text-xs flex items-center gap-1.5 text-slate-200">
          <FileCode className="w-4 h-4 text-amber-400" />
          <span>Especificación Técnica y Memoria Viva (README.md)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex-1 flex flex-col space-y-2 text-xs">
        <p className="text-[11px] text-slate-400">
          La IA actualiza este archivo con cada cambio estructural o de diseño.
        </p>
        <textarea
          rows={22}
          value={readmeText || `# 🚀 ${website.businessName}\n\n## 🎯 1. Visión y Propósito\n${website.hero?.subtitle || 'Sitio web comercial interactivo.'}\n\n## 🏗️ 2. Arquitectura\n- **Rubro:** ${website.detectedIndustry || 'Comercio'}`}
          onChange={(e) => onChangeReadme(e.target.value)}
          className="w-full flex-1 p-3 bg-slate-950 border border-slate-700 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none leading-relaxed"
        />
      </CardContent>
    </Card>
  );
};
