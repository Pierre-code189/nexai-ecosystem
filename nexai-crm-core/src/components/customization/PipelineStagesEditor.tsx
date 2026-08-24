'use client';

import React, { useState } from 'react';
import { useCRMData } from '@/context/CRMDataContext';
import { useTenant } from '@/context/TenantContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PipelineStageDefinition } from '@/types/industry';
import { Plus, Trash2, Layers } from 'lucide-react';
import { generateId } from '@/lib/utils';

export const PipelineStagesEditor: React.FC = () => {
  const { currentTenant } = useTenant();
  const { updateStages } = useCRMData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newColor, setNewColor] = useState('#3b82f6');

  const handleAddStage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newStage: PipelineStageDefinition = {
      id: generateId('stage'),
      title: newTitle.trim(),
      color: newColor,
      order: currentTenant.stages.length,
    };

    await updateStages([...currentTenant.stages, newStage]);
    setNewTitle('');
    setIsModalOpen(false);
  };

  const handleDeleteStage = async (stageId: string) => {
    if (currentTenant.stages.length <= 1) {
      alert('Debe existir al menos una etapa en el pipeline.');
      return;
    }
    const filtered = currentTenant.stages.filter((s) => s.id !== stageId);
    await updateStages(filtered);
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Etapas del Pipeline de Ventas</CardTitle>
          <CardDescription>
            Personaliza el flujo de conversión agregando o modificando etapas.
          </CardDescription>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Nueva Etapa
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2.5">
          {currentTenant.stages.map((stage, idx) => (
            <div
              key={stage.id}
              className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-500 w-5">{idx + 1}.</span>
                <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: stage.color }} />
                <span className="text-xs font-bold text-slate-200">{stage.title}</span>
              </div>
              <button
                onClick={() => handleDeleteStage(stage.id)}
                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nueva Etapa de Pipeline"
        description="Esta etapa aparecerá en el tablero Kanban de ventas."
      >
        <form onSubmit={handleAddStage} className="space-y-4">
          <Input
            label="Nombre de la Etapa"
            placeholder="Ej. En Negociación, Visita Técnica, Pago Confirmado..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">Color Identificador</label>
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="w-12 h-10 rounded-lg cursor-pointer bg-slate-950 border border-slate-700"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar Etapa
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};
