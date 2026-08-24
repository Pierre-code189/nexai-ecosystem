'use client';

import React, { useState } from 'react';
import { DealModal } from './DealModal';
import { PDFQuoteGeneratorModal } from './PDFQuoteGeneratorModal';
import { useCRMData } from '@/context/CRMDataContext';
import { useTenant } from '@/context/TenantContext';
import { PipelineDeal } from '@/types/crm';
import { Button } from '@/components/ui/Button';
import { Plus, FileText } from 'lucide-react';

export const KanbanBoard: React.FC = () => {
  const { currentTenant, currentPreset } = useTenant();
  const { deals, deleteDeal, moveDealToStage } = useCRMData();

  const [isNewDealOpen, setIsNewDealOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<PipelineDeal | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedDealForQuote, setSelectedDealForQuote] = useState<PipelineDeal | null>(null);
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

  const stages = currentTenant.stages || currentPreset.defaultStages || [];

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId);
    setDraggedDealId(dealId);
  };

  const handleDropOnStage = async (e: React.DragEvent, targetStageId: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain') || draggedDealId;
    if (dealId) {
      await moveDealToStage(dealId, targetStageId);
      setDraggedDealId(null);
    }
  };

  const handleOpenQuoteGenerator = (deal: PipelineDeal) => {
    setSelectedDealForQuote(deal);
    setIsQuoteModalOpen(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] space-y-4">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-xl font-black text-slate-100 tracking-tight flex items-center gap-2">
            {currentPreset.terminology.dealsTitle}
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono font-bold">
              {deals.length} Oportunidades
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Arrastra las tarjetas interactivas entre columnas para avanzar de etapa.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsQuoteModalOpen(true)}
            leftIcon={<FileText className="w-3.5 h-3.5 text-amber-400" />}
          >
            Generar Cotización PDF
          </Button>

          <Button
            size="sm"
            onClick={() => setIsNewDealOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nuevo Trato
          </Button>
        </div>
      </div>

      {/* Dynamic Draggable Kanban Columns */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-start select-none">
        {stages.map((stage) => {
          const stageDeals = deals.filter((d) => d.stageId === stage.id);
          const stageTotal = stageDeals.reduce((sum, d) => sum + Number(d.value || 0), 0);

          return (
            <div
              key={stage.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDropOnStage(e, stage.id)}
              className="w-72 sm:w-80 flex-shrink-0 bg-slate-900/70 border border-slate-800/80 rounded-2xl flex flex-col max-h-full transition-colors hover:border-slate-700"
            >
              <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color || '#3b82f6' }} />
                  <h3 className="font-bold text-xs text-slate-200 truncate">{stage.title}</h3>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                    {stageDeals.length}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-400">
                  S/ {stageTotal.toLocaleString()}
                </span>
              </div>

              <div className="flex-1 p-2.5 overflow-y-auto space-y-2.5">
                {stageDeals.length === 0 ? (
                  <div className="h-28 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-[11px] text-slate-600">
                    Arrastra aquí
                  </div>
                ) : (
                  stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      onClick={() => setEditingDeal(deal)}
                      className="p-3.5 bg-slate-950 border border-slate-800 hover:border-blue-500/50 rounded-xl cursor-grab active:cursor-grabbing shadow-md transition-all space-y-2 group"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-xs text-slate-100 group-hover:text-blue-400 transition-colors">
                          {deal.title}
                        </h4>
                        <span className="text-xs font-mono font-extrabold text-emerald-400">
                          S/ {Number(deal.value).toLocaleString()}
                        </span>
                      </div>

                      {deal.contactName && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <span>👤 {deal.contactName}</span>
                          {deal.contactPhone && <span className="text-slate-500 font-mono">({deal.contactPhone})</span>}
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenQuoteGenerator(deal);
                          }}
                          className="text-amber-400 hover:underline flex items-center gap-1"
                        >
                          <FileText className="w-3 h-3" /> Cotizar PDF
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteDeal(deal.id);
                          }}
                          className="text-slate-600 hover:text-red-400 transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <DealModal
        isOpen={isNewDealOpen || !!editingDeal}
        onClose={() => {
          setIsNewDealOpen(false);
          setEditingDeal(null);
        }}
        deal={editingDeal}
      />

      <PDFQuoteGeneratorModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        selectedDeal={selectedDealForQuote}
      />
    </div>
  );
};
