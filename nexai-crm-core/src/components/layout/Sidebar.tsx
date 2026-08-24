'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Kanban,
  Users,
  MessageSquare,
  BarChart3,
  Sliders,
  Crown,
  QrCode,
  Globe,
  Zap,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/context/TenantContext';

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { currentTenant } = useTenant();

  const isSuperAdmin = user?.role === 'super_admin';

  const navItems = [
    { name: 'Panel General', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Embudo de Ventas', href: '/dashboard/pipeline', icon: Kanban, badge: 'Kanban' },
    { name: 'Clientes & Contactos', href: '/dashboard/contacts', icon: Users },
    { name: 'WhatsApp Bot IA', href: '/dashboard/whatsapp', icon: MessageSquare, badge: 'IA Live' },
    { name: 'Métricas de Ventas', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Estudio de Rubro', href: '/dashboard/customization', icon: Sliders },
    { name: 'Pasarela & Pagos QR', href: '/dashboard/settings', icon: QrCode },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between select-none font-sans transition-transform duration-300 md:static md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div>
        {/* Header with Close button on mobile */}
        <div className="h-16 px-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
              N
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-white flex items-center gap-1.5">
                NexCRM <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">v5.0</span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[140px]">
                {currentTenant?.name || 'Plataforma SaaS'}
              </p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg md:hidden">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Super Admin Action Box */}
        {isSuperAdmin && (
          <div className="p-3 mx-3 mt-3 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <Link href="/dashboard/admin" className="text-xs font-bold text-amber-300 hover:underline">
                Panel Super Admin
              </Link>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
              PROPIETARIO
            </span>
          </div>
        )}

        {/* Direct Link to Generated Web */}
        <div className="px-3 mt-3">
          <a
            href={`http://82.39.109.192:3000/sites/${currentTenant?.slug || 'kiras-pizza'}`}
            target="_blank"
            rel="noreferrer"
            className="w-full p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <span className="block text-[10px] font-semibold text-slate-400">Sitio Web del Negocio:</span>
                <span className="font-mono text-[11px] text-slate-200 truncate block max-w-[130px]">/sites/{currentTenant?.slug || 'kiras-pizza'}</span>
              </div>
            </div>
            <Zap className="w-3 h-3 text-amber-400" />
          </a>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 font-bold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & WhatsApp Bot Status Card */}
      <div className="p-3 border-t border-slate-800/80 space-y-2 bg-slate-950/60">
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-bold text-slate-200 text-[11px]">WhatsApp Bot & Asistente IA</span>
          </div>
        </div>
        <Link
          href="/dashboard/whatsapp"
          onClick={onClose}
          className="w-full py-1.5 text-center text-[10px] font-mono font-bold text-emerald-400 hover:bg-emerald-500/10 rounded-lg block transition-colors border border-emerald-500/20"
        >
          Abrir Consola WhatsApp
        </Link>
      </div>
    </aside>
  );
};
