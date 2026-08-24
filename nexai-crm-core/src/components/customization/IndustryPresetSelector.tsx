'use client';

import React from 'react';
import { useTenant } from '@/context/TenantContext';
import { INDUSTRY_PRESETS } from '@/lib/solid/IndustryPresets';
import { IndustryType } from '@/types/industry';
import { Building2, Stethoscope, ShoppingBag, Briefcase, Settings2, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

export const IndustryPresetSelector: React.FC = () => {
  const { currentTenant, changeIndustry } = useTenant();

  const iconMap: Record<string, any> = {
    real_estate: Building2,
    medical: Stethoscope,
    retail: ShoppingBag,
    services: Briefcase,
    custom: Settings2,
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Selección de Rubro / Cascarón Dinámico</CardTitle>
          <CardDescription>
            Cambia la arquitectura de datos, etapas de venta y terminología con un solo clic.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(Object.keys(INDUSTRY_PRESETS) as IndustryType[]).map((key) => {
            const preset = INDUSTRY_PRESETS[key];
            const Icon = iconMap[key] || Settings2;
            const isSelected = currentTenant.industry === key;

            return (
              <div
                key={key}
                onClick={() => changeIndustry(key)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-[var(--color-primary,#3b82f6)] ring-1 ring-[var(--color-primary,#3b82f6)] shadow-xl'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-[var(--color-primary,#3b82f6)] text-white flex items-center justify-center shadow-md">
                    <Check className="w-3 h-3" />
                  </div>
                )}
                <div>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${preset.primaryColor}20`, color: preset.primaryColor }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">{preset.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{preset.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{preset.defaultStages.length} Etapas</span>
                  <span>{preset.contactFields.length + preset.dealFields.length} Campos auto</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
