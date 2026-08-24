'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useCRMData } from '@/context/CRMDataContext';
import { useTenant } from '@/context/TenantContext';
import { formatCurrency } from '@/lib/utils';

export const RevenueChart: React.FC = () => {
  const { deals, metrics } = useCRMData();
  const { currentTenant } = useTenant();

  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const currentMonthIdx = new Date().getMonth();
  
  // Mostrar los últimos 6 meses dinámicamente según la fecha actual
  const last6Months = Array.from({ length: 6 }).map((_, i) => {
    const idx = (currentMonthIdx - 5 + i + 12) % 12;
    return { name: monthNames[idx], monthIndex: idx, total: 0 };
  });

  // Agrupar ventas reales por mes de creación o cierre
  deals.forEach((deal) => {
    try {
      const dealDate = new Date(deal.createdAt || Date.now());
      const mIdx = dealDate.getMonth();
      const match = last6Months.find((m) => m.monthIndex === mIdx);
      if (match) {
        match.total += Number(deal.value) || 0;
      } else if (last6Months.length > 0) {
        last6Months[last6Months.length - 1].total += Number(deal.value) || 0;
      }
    } catch {
      // ignore
    }
  });

  const maxVal = Math.max(...last6Months.map((m) => m.total), 1);

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div>
          <CardTitle>Evolución de Ingresos & Pipeline</CardTitle>
          <CardDescription>Crecimiento calculado en tiempo real ({currentTenant.currency})</CardDescription>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Total en Pipeline</span>
          <p className="text-lg font-bold text-emerald-400">{formatCurrency(metrics.totalRevenue, currentTenant.currency)}</p>
        </div>
      </CardHeader>
      <CardContent>
        {deals.length === 0 ? (
          <div className="h-56 flex flex-col items-center justify-center text-xs text-slate-500 space-y-2 border border-dashed border-slate-800 rounded-xl">
            <span>Aún no hay tratos registrados en tu pipeline.</span>
            <span className="text-[11px] text-slate-600">Crea una oportunidad o conecta tu web para ver los gráficos de evolución.</span>
          </div>
        ) : (
          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {last6Months.map((m, idx) => {
              const heightPercent = Math.max(12, Math.round((m.total / maxVal) * 100));
              const isCurrent = idx === last6Months.length - 1;
              return (
                <div key={m.name} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full flex justify-center items-end h-40">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[42px] rounded-t-xl transition-all duration-500 group-hover:opacity-100 ${
                        isCurrent
                          ? 'bg-gradient-to-t from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/20'
                          : 'bg-slate-800 group-hover:bg-slate-700 opacity-80'
                      }`}
                    />
                  </div>
                  <span className={`text-[11px] font-medium ${isCurrent ? 'text-blue-400 font-bold' : 'text-slate-500'}`}>
                    {m.name}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
