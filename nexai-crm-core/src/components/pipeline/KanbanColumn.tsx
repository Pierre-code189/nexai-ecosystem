'use client';

import React from 'react';
import { PipelineStageDefinition } from '@/types/industry';
import { PipelineDeal } from '@/types/crm';
import { DealCard } from './DealCard';
import { useTenant } from '@/context/TenantContext';
import { formatCurrency } from '@/lib/utils';
import { Plus } from 'lucide-react';

interface KanbanColumnProps {
  stage: PipelineStageDefinition;
  deals: PipelineDeal[];
  onAddDealToStage: (stageId: string) => void;
  onEditDeal: (deal: PipelineDeal) => void;
  onMoveToNextStage: (deal: PipelineDeal) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  stage,
  deals,
  onAddDealToStage,
  onEditDeal,
  onMoveToNextStage,
}) => {
  const { currentTenant } = useTenant();
  const totalValue = deals.reduce((acc, d) => acc + (Number(d.value) || 0), 0);

  return (
    <div className="flex-1 min-w-[280px] max-w-[340px] bg-slate-950/60 border border-slate-800/80 rounded-2xl flex flex-col max-h-[calc(100vh-180px)]">
      {/* Column Header */}
      <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
          <h3 className="text-xs font-bold text-slate-200">{stage.title}</h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono font-semibold">
            {deals.length}
          </span>
        </div>
        <button
          onClick={() => onAddDealToStage(stage.id)}
          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
          title="Agregar oportunidad"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="px-3.5 py-1.5 bg-slate-900/30 text-[11px] text-slate-400 border-b border-slate-800/40 flex justify-between font-mono">
        <span>Total:</span>
        <span className="font-semibold text-slate-200">{formatCurrency(totalValue, currentTenant.currency)}</span>
      </div>

      {/* Cards List */}
      <div className="p-3 space-y-2.5 flex-1 overflow-y-auto">
        {deals.length === 0 ? (
          <div className="h-32 border-2 border-dashed border-slate-800/80 rounded-xl flex items-center justify-center text-slate-600 text-xs">
            Sin oportunidades
          </div>
        ) : (
          deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onEdit={onEditDeal}
              onMoveToNextStage={onMoveToNextStage}
            />
          ))
        )}
      </div>
    </div>
  );
};
