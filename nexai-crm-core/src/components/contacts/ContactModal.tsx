'use client';

import React, { useState, useEffect } from 'react';
import { Contact } from '@/types/crm';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useCRMData } from '@/context/CRMDataContext';
import { useTenant } from '@/context/TenantContext';
import { DynamicFieldRenderer } from './DynamicFieldRenderer';

export interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: Contact | null;
  onSave?: (contact: Partial<Contact>) => void;
  onDelete?: (id: string) => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  contact,
  onSave,
  onDelete,
}) => {
  const { addContact, updateContact, deleteContact } = useCRMData();
  const { currentTenant } = useTenant();

  const [formData, setFormData] = useState<Partial<Contact>>({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead',
    tags: [],
    customData: {},
    notes: '',
  });

  const isEditing = Boolean(contact && contact.id);

  useEffect(() => {
    if (contact) {
      setFormData({ ...contact, customData: contact.customData || {} });
    } else {
      setFormData({ name: '', email: '', phone: '', company: '', status: 'lead', tags: [], customData: {}, notes: '' });
    }
  }, [contact, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    if (onSave) {
      onSave(formData);
    } else if (isEditing && contact?.id) {
      await updateContact(contact.id, formData);
    } else {
      await addContact(formData);
    }
    onClose();
  };

  const contactFields = (currentTenant.customFields || []).filter(
    (f) => f.entityType === 'contact'
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Contacto' : 'Nuevo Contacto'}
      description={isEditing ? 'Modifica los datos del contacto.' : 'Registra un nuevo prospecto o cliente.'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <Input
          label="Nombre Completo *"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Teléfono / WhatsApp"
            value={formData.phone || ''}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            label="Correo Electrónico"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Empresa / Negocio"
            value={formData.company || ''}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
          <Select
            label="Estado Comercial"
            value={formData.status || 'lead'}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            options={[
              { value: 'lead', label: 'Prospecto (Lead)' },
              { value: 'customer', label: 'Cliente Activo' },
              { value: 'inactive', label: 'Inactivo' },
            ]}
          />
        </div>

        {contactFields.length > 0 && (
          <div className="pt-3 border-t border-slate-800 space-y-3">
            <span className="font-bold text-slate-300 block">Campos del Rubro:</span>
            {contactFields.map((field) => (
              <DynamicFieldRenderer
                key={field.id}
                field={field}
                value={formData.customData?.[field.key]}
                onChange={(val) =>
                  setFormData({
                    ...formData,
                    customData: { ...formData.customData, [field.key]: val },
                  })
                }
              />
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
          {isEditing && contact?.id ? (
            <button
              type="button"
              onClick={() => {
                if (onDelete && contact?.id) onDelete(contact.id);
                else if (contact?.id) deleteContact(contact.id);
                onClose();
              }}
              className="px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
            >
              Eliminar Contacto
            </button>
          ) : <div />}
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Guardar Cambios' : 'Crear Contacto'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
