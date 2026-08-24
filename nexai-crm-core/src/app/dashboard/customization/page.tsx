'use client';

import React from 'react';
import { AIIndustryGenerator } from '@/components/customization/AIIndustryGenerator';
import { IndustryPresetSelector } from '@/components/customization/IndustryPresetSelector';
import { ThemeCustomizer } from '@/components/customization/ThemeCustomizer';
import { CustomFieldsEditor } from '@/components/customization/CustomFieldsEditor';
import { PipelineStagesEditor } from '@/components/customization/PipelineStagesEditor';

export default function CustomizationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-100 tracking-tight">
          Estudio de Rubro & Cascarón Dinámico Inteligente
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Permite que la IA reconozca tu industria o personaliza manualmente las etapas, campos y diseño de marca.
        </p>
      </div>

      {/* 1. Generador de Cascarón Inteligente con IA */}
      <AIIndustryGenerator />

      {/* 2. Presets y Personalización Manual */}
      <IndustryPresetSelector />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ThemeCustomizer />
        <PipelineStagesEditor />
      </div>

      <CustomFieldsEditor />
    </div>
  );
}
