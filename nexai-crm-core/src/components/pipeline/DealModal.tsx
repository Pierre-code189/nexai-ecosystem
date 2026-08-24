'use client';

import React, { useState, useEffect } from 'react';
import { PipelineDeal } from '@/types/crm';
import { useTenant } from '@/context/TenantContext';
import { useCRMData } from '@/context/CRMDataContext';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { DynamicFieldRenderer } from '@/components/contacts/DynamicFieldRenderer';

export interface DealModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal?: PipelineDeal | null;
  initialStageId?: string;
  onSave?: (data: Partial<PipelineDeal>) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export const DealModal: React.FC<DealModalProps> = ({
  isOpen,
  onClose,
  deal = null,
  initialStageId,
  onSave,
  onDelete,
}) => {
  const { currentTenant } = useTenant();
  const { contacts, addDeal, updateDeal } = useCRMData();

  const [title, setTitle] = useState('');
  const [value, setValue] = useState<number>(0);
  const [stageId, setStageId] = useState('');
  const [contactId, setContactId] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [customData, setCustomData] = useState<Record<string, any>>({});
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (deal) {
      setTitle(deal.title || '');
      setValue(deal.value || 0);
      setStageId(deal.stageId || '');
      setContactId(deal.contactId || '');
      setPriority(deal.priority || 'medium');
      setCustomData(deal.customData || {});
      setNotes(deal.notes || '');
    } else {
      setTitle('');
      setValue(0);
      setStageId(initialStageId || currentTenant.stages[0]?.id || '');
      setContactId(contacts[0]?.id || '');
      setPriority('medium');
      setCustomData({});
      setNotes('');
    }
  }, [deal, initialStageId, currentTenant, isOpen, contacts]);

  const dealCustomFields = currentTenant.customFields.filter((f) => f.entityType === 'deal');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const contactObj = contacts.find((c) => c.id === contactId);

    const dealPayload: Partial<PipelineDeal> = {
      title,
      value: Number(value) || 0,
      stageId: stageId || currentTenant.stages[0]?.id || 'stage_lead',
      contactId,
      contactName: contactObj?.name || 'Cliente sin asignar',
      contactPhone: contactObj?.phone || '',
      priority,
      customData,
      notes,
    };

    try {
      if (onSave) {
        await onSave(dealPayload);
      } else if (deal?.id) {
        await updateDeal(deal.id, dealPayload);
      } else {
        await addDeal(dealPayload);
      }
      onClose();
    } catch (err) {
      console.error('Error guardando oportunidad:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={deal ? 'Editar Oportunidad' : 'Nueva Oportunidad'}
      description="Configura los detalles comerciales y los campos específicos según el rubro."
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Título de la Oportunidad / Negocio"
          placeholder="Ej. Pedido Familiar 3 Pizzas / Consulta Ortodoncia..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label={`Valor (${currentTenant.currency || 'S/'})`}
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            required
          />
          <Select
            label="Prioridad"
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            options={[
              { label: 'Alta', value: 'high' },
              { label: 'Media', value: 'medium' },
              { label: 'Baja', value: 'low' },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Etapa del Pipeline"
            value={stageId}
            onChange={(e) => setStageId(e.target.value)}
            options={currentTenant.stages.map((s) => ({ label: s.title, value: s.id }))}
          />
          <Select
            label="Contacto / Cliente Asignado"
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            options={
              contacts.length > 0
                ? contacts.map((c) => ({ label: `${c.name} (${c.phone || c.email})`, value: c.id }))
                : [{ label: 'Sin contactos registrados', value: '' }]
            }
          />
        </div>

        {/* Dynamic Fields */}
        {dealCustomFields.length > 0 && (
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Campos Dinámicos del Rubro
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dealCustomFields.map((field) => (
                <DynamicFieldRenderer
                  key={field.id}
                  field={field}
                  value={customData[field.key]}
                  onChange={(val) => setCustomData((prev) => ({ ...prev, [field.key]: val }))}
                />
              ))}
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">Notas & Observaciones</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Comentarios sobre el trato..."
            className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
          {deal && onDelete ? (
            <Button variant="danger" type="button" size="sm" onClick={() => onDelete(deal.id)}>
              Eliminar
            </Button>
          ) : <div />}
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" isLoading={isSaving}>
              Guardar Oportunidad
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
