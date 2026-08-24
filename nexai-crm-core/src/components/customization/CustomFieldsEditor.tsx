'use client';

import React, { useState } from 'react';
import { useCRMData } from '@/context/CRMDataContext';
import { useTenant } from '@/context/TenantContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { CustomFieldDefinition, FieldType } from '@/types/industry';
import { Plus, Trash2, Tag } from 'lucide-react';
import { generateId } from '@/lib/utils';

export const CustomFieldsEditor: React.FC = () => {
  const { currentTenant } = useTenant();
  const { addCustomField, deleteCustomField } = useCRMData();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [label, setLabel] = useState('');
  const [type, setType] = useState<FieldType>('text');
  const [entityType, setEntityType] = useState<'contact' | 'deal'>('contact');

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;

    const key = label.toLowerCase().replace(/[^a-z0-9]/g, '');
    const newField: CustomFieldDefinition = {
      id: generateId('field'),
      key,
      label: label.trim(),
      type,
      entityType,
      required: false,
    };

    await addCustomField(newField);
    setLabel('');
    setIsModalOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Constructor de Campos Dinámicos</CardTitle>
          <CardDescription>
            Agrega campos a medida para tus contactos u oportunidades de venta.
          </CardDescription>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
          Agregar Campo
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentTenant.customFields.map((field) => (
            <div
              key={field.id}
              className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-xs font-bold text-slate-200">{field.label}</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Entidad: {field.entityType.toUpperCase()} | Tipo: {field.type.toUpperCase()}
                </div>
              </div>
              <button
                onClick={() => deleteCustomField(field.id)}
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
        title="Crear Campo Dinámico"
        description="El campo aparecerá de inmediato en los formularios y tablas correspondientes."
      >
        <form onSubmit={handleAddField} className="space-y-4">
          <Input
            label="Nombre o Etiqueta del Campo"
            placeholder="Ej. Metros Cuadrados, Número de Paciente, Canal..."
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Asignar a Entidad"
              value={entityType}
              onChange={(e) => setEntityType(e.target.value as any)}
              options={[
                { label: 'Contactos', value: 'contact' },
                { label: 'Oportunidades (Deals)', value: 'deal' },
              ]}
            />
            <Select
              label="Tipo de Dato"
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              options={[
                { label: 'Texto', value: 'text' },
                { label: 'Número', value: 'number' },
                { label: 'Fecha', value: 'date' },
                { label: 'Lista Desplegable (Select)', value: 'select' },
              ]}
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar Campo
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
};
