'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, LogOut, Shield, Crown, ChevronDown, Menu, Globe, ExternalLink, Activity, Wifi, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';
import { useAuth } from '@/context/AuthContext';
import { TenantSelector } from './TenantSelector';
import { db } from '@/lib/firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

export const Header: React.FC<{ onOpenMobileMenu?: () => void }> = ({ onOpenMobileMenu }) => {
  const { currentTenant } = useTenant();
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isHealthMenuOpen, setIsHealthMenuOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  // Estados reales de los 4 servicios monitoreados
  const [health, setHealth] = useState({
    webBuilder: { status: 'online' },
    whatsappBot: { status: 'offline', phoneNumber: null as string | null, message: 'Comprobando...' },
    colabAi: { status: 'checking', message: 'Comprobando...' },
    firestore: { status: 'online' },
  });

  const isSuperAdmin = user?.role === 'super_admin';
  const webBuilderUrl = process.env.NEXT_PUBLIC_WEB_BUILDER_URL || 'https://nexai-web-builder.vercel.app';
  const siteUrl = isSuperAdmin ? webBuilderUrl : `${webBuilderUrl}/sites/${currentTenant.slug || 'kiras-pizza'}`;
  const siteLabel = isSuperAdmin ? 'Portal Web Builder' : 'Ver Mi Web';

  const checkSystemHealth = async () => {
    setIsChecking(true);
    try {
      const res = await fetch('/api/system/health');
      if (res.ok) {
        const data = await res.json();
        setHealth({
          webBuilder: { status: data.webBuilder.status },
          whatsappBot: { status: data.whatsappBot.status, phoneNumber: data.whatsappBot.phoneNumber, message: data.whatsappBot.message },
          colabAi: { status: data.colabAi.status, message: data.colabAi.message },
          firestore: { status: data.firestore.status },
        });
      }
    } catch {
      // fallback
    } finally {
      setIsChecking(false);
    }
  };

  // Listener en Tiempo Real para WhatsApp Gateway Status desde Firestore
  useEffect(() => {
    checkSystemHealth();

    let unsubscribeGW: (() => void) | null = null;
    let unsubscribeAI: (() => void) | null = null;

    try {
      if (db) {
        // Escucha en tiempo real del Gateway de WhatsApp
                unsubscribeGW = onSnapshot(doc(db, 'system', 'whatsapp_gateway_status'), (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            const lastHeartbeat = data.lastHeartbeat || data.updatedAt;
            const isAlive = lastHeartbeat ? (Date.now() - new Date(lastHeartbeat).getTime()) < 35000 : false;
            
            setHealth((prev) => ({
              ...prev,
              whatsappBot: {
                status: (data.status === 'connected' && isAlive) ? 'online' : (data.status === 'qr_ready' && isAlive) ? 'qr_ready' : 'offline',
                phoneNumber: data.phoneNumber || null,
                message: (data.status === 'connected' && isAlive) ? `Conectado: ${data.phoneNumber || 'Activo'}` : (data.status === 'qr_ready' && isAlive) ? 'QR Listo para escanear' : 'Desconectado',
              },
            }));
          }
        });

        // Escucha en tiempo real de la configuración de IA
        unsubscribeAI = onSnapshot(doc(db, 'system', 'ai_server_config'), (snap) => {
          if (snap.exists()) {
            checkSystemHealth();
          }
        });
      }
    } catch (e) {
      console.warn('Aviso listener header:', e);
    }

    const interval = setInterval(checkSystemHealth, 20000);
    return () => {
      clearInterval(interval);
      if (unsubscribeGW) unsubscribeGW();
      if (unsubscribeAI) unsubscribeAI();
    };
  }, []);

  const isEcosystemHealthy = health.firestore.status === 'online';

  return (
    <header className="h-16 px-4 sm:px-6 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="p-2 text-slate-400 hover:text-white rounded-lg md:hidden hover:bg-slate-900 transition-colors"
            title="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <TenantSelector />

        <div className="relative w-full max-w-xs hidden lg:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar contactos, tratos (Ctrl + K)..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-900 border border-slate-700/80 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* LED INDICATOR PANEL: Monitor de Conectividad en Tiempo Real */}
        <div className="relative">
          <button
            onClick={() => setIsHealthMenuOpen(!isHealthMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-full text-xs font-mono transition-all"
            title="Ver estado en vivo de los servicios"
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                health.whatsappBot.status === 'online' && health.colabAi.status === 'online'
                  ? 'bg-emerald-400 animate-ping'
                  : health.whatsappBot.status === 'online' || health.colabAi.status === 'online'
                  ? 'bg-emerald-400'
                  : 'bg-amber-400 animate-pulse'
              }`}
            />
            <span className="hidden md:inline text-[11px] font-bold text-slate-300">
              {health.whatsappBot.status === 'online' && health.colabAi.status === 'online'
                ? 'Ecosistema 100% Online'
                : health.whatsappBot.status === 'online'
                ? 'WhatsApp Bot Online'
                : health.colabAi.status === 'online'
                ? 'VPS CPU (Qwen 1.5B) Conectada'
                : 'Monitor de Servicios'}
            </span>
          </button>

          {isHealthMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-3.5 text-xs space-y-2.5 animate-in fade-in zoom-in-95">
              <div className="pb-2 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">
                    Monitor de Conectividad Real
                  </span>
                </div>
                <button
                  onClick={checkSystemHealth}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  title="Re-verificar ahora"
                >
                  <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin text-blue-400' : ''}`} />
                </button>
              </div>

              <div className="space-y-2 text-[11px]">
                {/* Web Builder */}
                <div className="flex items-center justify-between p-2 bg-slate-950 rounded-xl border border-slate-800/80">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-200">🌐 NexAI Web Builder</span>
                    <span className="text-[10px] text-slate-500 font-mono">Puerto 3000 / Vercel</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] ${
                    health.webBuilder.status === 'online' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300'
                  }`}>
                    {health.webBuilder.status === 'online' ? 'ONLINE' : 'OFFLINE'}
                  </span>
                </div>

                {/* Ollama VPS Local IA */}
                <div className="flex items-center justify-between p-2 bg-slate-950 rounded-xl border border-slate-800/80">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-200">🧠 Servidor IA (Ollama VPS Local)</span>
                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-[140px]">
                      {health.colabAi.message}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] ${
                    health.colabAi.status === 'online'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : health.colabAi.status === 'groq_fallback'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {health.colabAi.status === 'online'
                      ? 'VPS CPU (Qwen 1.5B) ONLINE'
                      : health.colabAi.status === 'groq_fallback'
                      ? 'RESPALDO GROQ'
                      : 'OFFLINE'}
                  </span>
                </div>

                {/* WhatsApp Bot */}
                <div className="flex items-center justify-between p-2 bg-slate-950 rounded-xl border border-slate-800/80">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-200">💬 WhatsApp Bot (Baileys)</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {health.whatsappBot.phoneNumber ? health.whatsappBot.phoneNumber : health.whatsappBot.message}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[9px] ${
                    health.whatsappBot.status === 'online'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : health.whatsappBot.status === 'qr_ready'
                      ? 'bg-amber-500/20 text-amber-300 animate-pulse border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {health.whatsappBot.status === 'online'
                      ? 'CONECTADO'
                      : health.whatsappBot.status === 'qr_ready'
                      ? 'QR PENDIENTE'
                      : 'DESCONECTADO'}
                  </span>
                </div>

                {/* Firestore */}
                <div className="flex items-center justify-between p-2 bg-slate-950 rounded-xl border border-slate-800/80">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-200">🔥 Base de Datos (Firestore)</span>
                    <span className="text-[10px] text-slate-500 font-mono">nexai-crm-database</span>
                  </div>
                  <span className="px-2 py-0.5 rounded font-mono font-bold text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    CONECTADO
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Super Admin Master Badge */}
        {isSuperAdmin && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-full text-xs font-bold shadow-md shadow-amber-500/10">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Super Admin</span>
          </div>
        )}

        {/* Link to Website / Web Builder Portal */}
        <a
          href={siteUrl}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-full text-xs font-semibold transition-colors"
        >
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>{siteLabel}</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>

        {/* User Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-900 transition-colors"
          >
            <div className={`w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-xs shadow-md ${
              isSuperAdmin ? 'bg-gradient-to-tr from-amber-500 to-orange-600 ring-2 ring-amber-400/50' : 'bg-gradient-to-tr from-blue-600 to-indigo-600'
            }`}>
              {user?.displayName ? user.displayName.substring(0, 2).toUpperCase() : 'AD'}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 p-2 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="font-bold text-slate-100 truncate flex items-center gap-1.5">
                  {user?.displayName || 'Administrador'}
                  {isSuperAdmin && <Crown className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                </p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                <span className={`inline-block mt-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                  isSuperAdmin ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                }`}>
                  {isSuperAdmin ? '👑 SUPER ADMIN' : '🏢 ADMINISTRADOR'}
                </span>
              </div>
              <div className="py-1">
                <a
                  href={siteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-blue-400 hover:bg-blue-500/10 font-medium transition-colors"
                >
                  <span>{siteLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="border-t border-slate-800 pt-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 font-medium transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
