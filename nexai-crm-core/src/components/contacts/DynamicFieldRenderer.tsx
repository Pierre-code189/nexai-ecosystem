'use client';

import React from 'react';
import { CustomFieldDefinition } from '@/types/industry';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface DynamicFieldRendererProps {
  field: CustomFieldDefinition;
  value: any;
  onChange: (val: any) => void;
}

export const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({ field, value, onChange }) => {
  if (field.type === 'select' && field.options) {
    return (
      <Select
        label={field.label}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        options={[
          { label: 'Seleccionar...', value: '' },
          ...field.options.map((opt) => ({ label: opt.label, value: opt.value })),
        ]}
      />
    );
  }

  if (field.type === 'number') {
    return (
      <Input
        label={field.label}
        type="number"
        placeholder={field.placeholder}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
      />
    );
  }

  if (field.type === 'date') {
    return (
      <Input
        label={field.label}
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <Input
      label={field.label}
      type="text"
      placeholder={field.placeholder}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
