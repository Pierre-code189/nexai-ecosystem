'use client';

import React from 'react';
import Link from 'next/link';
import { useCRMData } from '@/context/CRMDataContext';
import { useTenant } from '@/context/TenantContext';
import { useAuth } from '@/context/AuthContext';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { PipelineSummary } from '@/components/dashboard/PipelineSummary';
import { formatCurrency } from '@/lib/utils';
import {
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle2,
  Kanban,
  MessageSquare,
  Sparkles,
  Crown,
  Building2,
  Globe,
} from 'lucide-react';

export default function DashboardOverviewPage() {
  const { currentTenant, currentPreset } = useTenant();
  const { metrics, deals, contacts } = useCRMData();
  const { user } = useAuth();

  const isSuperAdmin = user?.role === 'super_admin';

  return (
    <div className="space-y-6">
      {/* Super Admin Top Banner */}
      {isSuperAdmin && (
        <div className="p-4 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Crown className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Sesión de Super Administrador (Creador del SaaS)</h4>
              <p className="text-[11px] text-slate-400">Accede a la supervisión de todas las empresas y claves de IA.</p>
            </div>
          </div>
          <Link
            href="/dashboard/admin"
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl transition-all shadow"
          >
            Abrir Panel Super Admin
          </Link>
        </div>
      )}

      {/* Main Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900/80 border border-slate-800 rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              {isSuperAdmin ? 'Panel de Control de la Plataforma' : `Bienvenido al Panel de ${currentTenant.name}`}
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono">
              {currentTenant.currency || 'PEN'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Gestión comercial centralizada con IA para WhatsApp y pipeline dinámico en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard/pipeline"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Ver Tablero Kanban</span>
          </Link>
          <Link
            href="/dashboard/whatsapp"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Bot IA</span>
          </Link>
        </div>
      </div>

      {/* Dynamic Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="VALOR EN PIPELINE"
          value={formatCurrency(metrics.totalRevenue, currentTenant.currency)}
          change={metrics.totalRevenue > 0 ? '+18.4%' : '0%'}
          subtext={`${deals.length} oportunidades registradas`}
          icon={<DollarSign className="w-5 h-5 text-blue-400" />}
        />
        <MetricCard
          title="OPORTUNIDADES ACTIVAS"
          value={metrics.activeDealsCount}
          change={metrics.activeDealsCount > 0 ? `+${metrics.activeDealsCount} activas` : '0 activas'}
          subtext="En proceso de negociación"
          icon={<TrendingUp className="w-5 h-5 text-cyan-400" />}
        />
        <MetricCard
          title="TOTAL CLIENTES & LEADS"
          value={contacts.length}
          change={contacts.length > 0 ? `+${contacts.length}` : '0'}
          subtext="Base de datos de contactos"
          icon={<Users className="w-5 h-5 text-indigo-400" />}
        />
        <MetricCard
          title="TASA DE CIERRE / CONVERSIÓN"
          value={`${metrics.conversionRate}%`}
          change={metrics.conversionRate > 0 ? '+5.2%' : '0%'}
          subtext="Tratos ganados exitosamente"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        />
      </div>

      {/* Main Charts & Pipeline Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueChart />
        <PipelineSummary />
      </div>

      {/* Recent Activities */}
      <ActivityFeed />
    </div>
  );
}
