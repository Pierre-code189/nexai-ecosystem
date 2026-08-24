'use client';

import React from 'react';
import { useTenant } from '@/context/TenantContext';
import { ContactTable } from '@/components/contacts/ContactTable';

export default function ContactsPage() {
  const { currentPreset } = useTenant();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-black text-slate-100 tracking-tight">
          {currentPreset.terminology.contactsTitle}
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Directorio centralizado con campos dinámicos específicos para {currentPreset.name}.
        </p>
      </div>

      <ContactTable />
    </div>
  );
}
