'use client';

import React from 'react';
import { useTenant } from '@/context/TenantContext';
import { KanbanBoard } from '@/components/pipeline/KanbanBoard';

export default function PipelinePage() {
  const { currentPreset } = useTenant();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black text-slate-100 tracking-tight">
          {currentPreset.terminology.pipelineTitle}
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Tablero interactivo de oportunidades comerciales. Arrastra o avanza tratos a través de las etapas.
        </p>
      </div>

      <KanbanBoard />
    </div>
  );
}
