'use client';

import React, { useState } from 'react';
import { useTenant } from '@/context/TenantContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Palette, Check } from 'lucide-react';

export const ThemeCustomizer: React.FC = () => {
  const { currentTenant, updateTheme, updateTenant } = useTenant();

  const [primaryColor, setPrimaryColor] = useState(currentTenant.theme.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(currentTenant.theme.secondaryColor);
  const [tenantName, setTenantName] = useState(currentTenant.name);
  const [currency, setCurrency] = useState(currentTenant.currency);
  const [isSaved, setIsSaved] = useState(false);

  const presetColors = ['#3b82f6', '#0284c7', '#0d9488', '#10b981', '#f97316', '#8b5cf6', '#ec4899', '#ef4444'];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateTenant({ name: tenantName, currency });
    await updateTheme({ primaryColor, secondaryColor });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Personalización de Marca Blanca (White-Label)</CardTitle>
          <CardDescription>
            Ajusta los colores de marca, nombre comercial y moneda de facturación.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nombre de la Empresa"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              required
            />
            <Input
              label="Código de Moneda (ISO)"
              value={currency}
              onChange={(e) => setCurrency(e.target.value.toUpperCase())}
              placeholder="USD, PEN, EUR..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">Color Primario de la Marca</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer bg-slate-900 border border-slate-700"
              />
              <div className="flex gap-1.5 flex-wrap">
                {presetColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setPrimaryColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-lg transition-transform ${
                      primaryColor === c ? 'scale-110 ring-2 ring-white shadow-lg' : 'hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-slate-800">
            <Button variant="primary" type="submit" leftIcon={isSaved ? <Check className="w-4 h-4" /> : <Palette className="w-4 h-4" />}>
              {isSaved ? '¡Configuración Guardada!' : 'Aplicar Cambios de Marca'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
