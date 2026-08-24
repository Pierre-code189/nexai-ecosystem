'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useCRMData } from '@/context/CRMDataContext';
import { useTenant } from '@/context/TenantContext';
import { formatCurrency } from '@/lib/utils';
import { Layers } from 'lucide-react';

export const PipelineSummary: React.FC = () => {
  const { deals } = useCRMData();
  const { currentTenant, currentPreset } = useTenant();

  const stages = currentTenant.stages || currentPreset.defaultStages || [];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Layers className="w-4 h-4 text-purple-400" />
          Embudo por Etapas
        </CardTitle>
      </CardHeader>
      <CardContent>
        {deals.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
            0 tratos en el embudo.
          </div>
        ) : (
          <div className="space-y-3">
            {stages.map((stage) => {
              const stageDeals = deals.filter((d) => d.stageId === stage.id);
              const stageTotal = stageDeals.reduce((sum, d) => sum + Number(d.value || 0), 0);
              const percent = deals.length > 0 ? Math.round((stageDeals.length / deals.length) * 100) : 0;

              return (
                <div key={stage.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="flex items-center gap-2 text-slate-300 font-medium">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color || '#3b82f6' }} />
                      {stage.title}
                    </span>
                    <span className="font-mono text-slate-400 font-bold">
                      {stageDeals.length} tratos ({formatCurrency(stageTotal, currentTenant.currency)})
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${percent}%`, backgroundColor: stage.color || '#3b82f6' }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
