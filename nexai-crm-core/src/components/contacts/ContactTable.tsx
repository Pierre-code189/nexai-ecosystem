'use client';

import React, { useState } from 'react';
import { useCRMData } from '@/context/CRMDataContext';
import { useTenant } from '@/context/TenantContext';
import { Contact } from '@/types/crm';
import { ContactModal } from './ContactModal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Search, Plus, Download, Mail, Phone, Building } from 'lucide-react';

export const ContactTable: React.FC = () => {
  const { currentTenant, currentPreset } = useTenant();
  const { contacts, addContact, updateContact, deleteContact } = useCRMData();

  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search)
  );

  const handleExportCSV = () => {
    const headers = ['Nombre', 'Email', 'Telefono', 'Empresa', 'Estado'];
    const rows = filteredContacts.map((c) => [c.name, c.email, c.phone, c.company || '', c.status]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `contactos_${currentTenant.slug}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Buscar por nombre, email o teléfono...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary,#3b82f6)]"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportCSV} leftIcon={<Download className="w-3.5 h-3.5" />}>
            Exportar CSV
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setSelectedContact(null);
              setIsModalOpen(true);
            }}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Nuevo {currentPreset.terminology.contactSingle}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 border-b border-slate-800 uppercase font-semibold text-slate-400 tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Nombre & Contacto</th>
                <th className="px-6 py-3.5">Empresa</th>
                <th className="px-6 py-3.5">Estado</th>
                <th className="px-6 py-3.5">Datos Personalizados</th>
                <th className="px-6 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    No se encontraron {currentPreset.terminology.contactsTitle.toLowerCase()}.
                  </td>
                </tr>
              ) : (
                filteredContacts.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() => {
                      setSelectedContact(contact);
                      setIsModalOpen(true);
                    }}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-100 text-sm">{contact.name}</div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                        {contact.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3 text-slate-500" /> {contact.email}
                          </span>
                        )}
                        {contact.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" /> {contact.phone}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-300">
                      {contact.company ? (
                        <span className="flex items-center gap-1.5">
                          <Building className="w-3 h-3 text-slate-500" /> {contact.company}
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={contact.status === 'customer' ? 'green' : 'blue'}>
                        {contact.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {Object.entries(contact.customData || {}).map(([key, val]) => (
                          <span
                            key={key}
                            className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono"
                          >
                            {key}: {String(val)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm">
                        Ver Detalle
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contact={selectedContact}
        onSave={async (data) => {
          if (selectedContact) {
            await updateContact(selectedContact.id, data);
          } else {
            await addContact(data);
          }
          setIsModalOpen(false);
        }}
        onDelete={async (id) => {
          await deleteContact(id);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};
