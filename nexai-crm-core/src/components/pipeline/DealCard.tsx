'use client';

import React from 'react';
import { PipelineDeal } from '@/types/crm';
import { PipelineStageDefinition } from '@/types/industry';
import {
  Calendar,
  Phone,
  MessageSquare,
  ArrowRight,
  Clock,
} from 'lucide-react';
import { useCRMData } from '@/context/CRMDataContext';
import { useTenant } from '@/context/TenantContext';

export interface DealCardProps {
  deal: PipelineDeal;
  stages?: PipelineStageDefinition[];
  onOpenModal?: (deal: PipelineDeal) => void;
  onEdit?: (deal: PipelineDeal) => void;
  onMoveToNextStage?: (deal: PipelineDeal) => void;
}

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  stages,
  onOpenModal,
  onEdit,
  onMoveToNextStage,
}) => {
  const { moveDealToStage } = useCRMData();
  const { currentTenant } = useTenant();

  const allStages = stages || currentTenant.stages || [];
  const currentStageIndex = allStages.findIndex((s) => s.id === deal.stageId);
  const nextStage = allStages[currentStageIndex + 1];

  const priorityColors = {
    high: 'bg-red-500/15 text-red-400 border-red-500/30',
    medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    low: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  };

  const cleanPhone = (deal.contactPhone || '').replace(/[^0-9]/g, '');

  const handleClick = () => {
    if (onOpenModal) onOpenModal(deal);
    else if (onEdit) onEdit(deal);
  };

  const handleAdvance = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMoveToNextStage) {
      onMoveToNextStage(deal);
    } else if (nextStage) {
      moveDealToStage(deal.id, nextStage.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700/80 shadow-md hover:shadow-xl transition-all cursor-pointer space-y-3 group relative select-none"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-bold text-xs text-slate-100 group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
          {deal.title}
        </h4>
        <span
          className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full font-bold border flex-shrink-0 ${
            priorityColors[deal.priority || 'medium']
          }`}
        >
          {deal.priority || 'media'}
        </span>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-sm font-black text-emerald-400 font-mono">
          S/ {Number(deal.value || 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
        </span>
        <span className="text-[11px] text-slate-400 font-medium truncate max-w-[120px]">
          {deal.contactName || 'Cliente Web'}
        </span>
      </div>

      <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-1.5 font-mono">
          <Clock className="w-3 h-3 text-slate-500" />
          <span>{new Date(deal.createdAt || Date.now()).toLocaleDateString('es-PE', { day: '2-digit', month: 'short' })}</span>
        </div>

        <div className="flex items-center gap-1.5">
          {cleanPhone && (
            <a
              href={`https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(deal.contactName || '')},%20me%20comunico%20respecto%20a%20tu%20consulta.`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
              title="Abrir chat en WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
            </a>
          )}

          {nextStage && (
            <button
              onClick={handleAdvance}
              className="px-2 py-1 bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300 rounded-lg font-bold flex items-center gap-1 transition-all"
              title={`Avanzar a: ${nextStage.title}`}
            >
              <span>Avanzar</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
