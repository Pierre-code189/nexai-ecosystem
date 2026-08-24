'use client';

import React from 'react';
import { useCRMData } from '@/context/CRMDataContext';
import { useTenant } from '@/context/TenantContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { formatCurrency } from '@/lib/utils';
import { BarChart3, TrendingUp, Users, DollarSign, Clock, MessageSquare } from 'lucide-react';

export default function AnalyticsPage() {
  const { currentTenant } = useTenant();
  const { metrics, deals, contacts } = useCRMData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-100 tracking-tight">
          Analítica y Telemetría SaaS
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Indicadores clave de rendimiento comercial, volumen de ventas y tiempo de respuesta.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="MRR Estimado"
          value={formatCurrency(metrics.mrr, currentTenant.currency)}
          icon={DollarSign}
          change="+14.2%"
          subtitle="Ingresos Mensuales Recurrentes"
        />
        <MetricCard
          title="Tamaño Promedio de Trato"
          value={formatCurrency(metrics.avgDealSize, currentTenant.currency)}
          icon={TrendingUp}
          subtitle="Valor promedio por oportunidad"
        />
        <MetricCard
          title="Tiempo Promedio de Respuesta IA"
          value="1.2 seg"
          icon={Clock}
          change="-45%"
          subtitle="Ultra baja latencia con Groq/Llama"
        />
        <MetricCard
          title="Leads Capturados por WhatsApp"
          value="28"
          icon={MessageSquare}
          change="+8 esta semana"
          subtitle="Generados por el bot automáticamente"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Canal de Adquisición</CardTitle>
            <CardDescription>Distribución de contactos según origen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { channel: 'WhatsApp Bot Directo', count: 18, percent: 64, color: 'bg-emerald-500' },
              { channel: 'Sitio Web / Formulario', count: 6, percent: 21, color: 'bg-blue-500' },
              { channel: 'Recomendación / Directo', count: 4, percent: 15, color: 'bg-purple-500' },
            ].map((item) => (
              <div key={item.channel} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>{item.channel}</span>
                  <span className="font-mono">{item.count} leads ({item.percent}%)</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tasa de Éxito de Respuestas del Bot</CardTitle>
            <CardDescription>Calificación y engagement del asistente IA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-200">Mensajes Contestados Automáticamente</p>
                <p className="text-[11px] text-slate-500">Sin intervención humana</p>
              </div>
              <span className="text-xl font-black text-emerald-400 font-mono">92.8%</span>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-200">Citas / Visitas Agendadas por el Bot</p>
                <p className="text-[11px] text-slate-500">Generación de oportunidades</p>
              </div>
              <span className="text-xl font-black text-blue-400 font-mono">14 cerradas</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
