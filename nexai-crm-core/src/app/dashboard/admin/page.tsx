'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { useTenant } from '@/context/TenantContext';
import {
  Crown,
  Users,
  Building2,
  Globe,
  Key,
  Wifi,
  Check,
  Save,
  ExternalLink,
  RefreshCw,
  Zap,
} from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

export default function SuperAdminPage() {
  const { user } = useAuth();
  const { allTenants } = useTenant();

  const [globalTenants, setGlobalTenants] = useState<any[]>([]);
  const [globalUsersCount, setGlobalUsersCount] = useState<number>(0);
  const [colabUrl, setColabUrl] = useState('');
  const [groqKey, setGroqKey] = useState('');
  const [isKeysSaved, setIsKeysSaved] = useState(false);

  const [aiStatus, setAiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [aiStatusMessage, setAiStatusMessage] = useState('Comprobando servidor de IA...');

  useEffect(() => {
    async function loadData() {
      try {
        if (db) {
          const usersSnap = await getDocs(collection(db, 'users'));
          setGlobalUsersCount(usersSnap.size || 0);

          const tenantsSnap = await getDocs(collection(db, 'tenants'));
          const tenantsList = tenantsSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
          if (tenantsList.length > 0) {
            setGlobalTenants(tenantsList);
          } else {
            setGlobalTenants(allTenants);
          }

          // Cargar credenciales activas desde Firestore
          const configSnap = await getDoc(doc(db, 'system', 'ai_server_config'));
          if (configSnap.exists()) {
            const data = configSnap.data();
            if (data.ollamaApiUrl) setColabUrl(data.ollamaApiUrl);
            if (data.groqApiKey) setGroqKey(data.groqApiKey);
            if (data.ollamaApiUrl) {
              checkAiServer(data.ollamaApiUrl);
              return;
            }
          }
        }
      } catch (e) {
        console.warn('Error cargando datos de Firestore:', e);
        setGlobalTenants(allTenants);
      }

      let activeUrl = colabUrl;
      if (typeof window !== 'undefined') {
        const savedColab = localStorage.getItem('colab_ollama_url');
        if (savedColab) {
          setColabUrl(savedColab);
          activeUrl = savedColab;
        }
        const savedGroq = localStorage.getItem('master_groq_key');
        if (savedGroq) setGroqKey(savedGroq);
      }

      if (activeUrl) {
        checkAiServer(activeUrl);
      } else {
        setAiStatus('offline');
        setAiStatusMessage('Configura la URL de inferencia de IA');
      }
    }
    loadData();
  }, [allTenants]);

  const checkAiServer = async (targetUrl: string) => {
    if (!targetUrl.trim()) {
      setAiStatus('offline');
      setAiStatusMessage('Sin URL configurada');
      return;
    }
    setAiStatus('checking');
    setAiStatusMessage('Pingeando túnel de IA...');
    try {
      const res = await fetch('/api/ai/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAiStatus('online');
        setAiStatusMessage('VPS CPU (Qwen 1.5B) Online (Qwen 2.5 1.5B)');
      } else {
        setAiStatus('offline');
        setAiStatusMessage('Servidor de IA Desconectado');
      }
    } catch {
      setAiStatus('offline');
      setAiStatusMessage('Servidor de IA Desconectado');
    }
  };

  const handleSaveMasterKeys = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = colabUrl.trim();
    const cleanGroq = groqKey.trim();

    if (typeof window !== 'undefined') {
      localStorage.setItem('colab_ollama_url', cleanUrl);
      localStorage.setItem('master_groq_key', cleanGroq);
    }

    // Auto-Sincronizar con Firestore para todo el ecosistema (Web Builder, CRM, WhatsApp Bot)
    try {
      if (db) {
        await setDoc(doc(db, 'system', 'ai_server_config'), {
          ollamaApiUrl: cleanUrl,
          groqApiKey: cleanGroq,
          modelName: 'qwen2.5:1.5b',
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (err) {
      console.warn('Error guardando ai_server_config en Firestore:', err);
    }

    setIsKeysSaved(true);
    if (cleanUrl) await checkAiServer(cleanUrl);
    setTimeout(() => setIsKeysSaved(false), 2500);
  };

  if (user?.role !== 'super_admin') {
    return (
      <div className="p-8 text-center space-y-3 bg-slate-900 border border-slate-800 rounded-3xl max-w-lg mx-auto mt-12">
        <Crown className="w-10 h-10 text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">Acceso Restringido a Super Administradores</h2>
        <p className="text-xs text-slate-400">
          Esta sección es exclusiva para el creador de la plataforma NexAI.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold font-mono">
            <Crown className="w-3.5 h-3.5" />
            <span>PANEL MAESTRO DE SUPER ADMINISTRADOR</span>
          </div>
          <h1 className="text-2xl font-black text-slate-100 tracking-tight">
            Supervisión Global del SaaS NexAI
          </h1>
          <p className="text-xs text-slate-400">
            Gestiona clientes, sitios web generados y las claves maestras de IA auto-sincronizadas por base de datos.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-950/80 px-4 py-2 rounded-2xl border border-slate-800">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              aiStatus === 'online'
                ? 'bg-emerald-400 animate-ping'
                : aiStatus === 'checking'
                ? 'bg-amber-400 animate-pulse'
                : 'bg-red-500'
            }`}
          />
          <span
            className={`text-xs font-mono font-bold ${
              aiStatus === 'online'
                ? 'text-emerald-400'
                : aiStatus === 'checking'
                ? 'text-amber-400'
                : 'text-red-400'
            }`}
          >
            {aiStatus === 'online'
              ? 'VPS CPU (Qwen 1.5B) ONLINE'
              : aiStatus === 'checking'
              ? 'VERIFICANDO...'
              : 'COLAB DESCONECTADO'}
          </span>
        </div>
      </div>

      {/* Global SaaS KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <Building2 className="w-4 h-4 text-blue-400" /> Total Empresas Clientes
          </span>
          <p className="text-2xl font-black text-white font-mono">{globalTenants.length}</p>
          <span className="text-[10px] text-slate-500 font-semibold">En base de datos Firestore</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <Users className="w-4 h-4 text-emerald-400" /> Usuarios Registrados
          </span>
          <p className="text-2xl font-black text-white font-mono">{globalUsersCount}</p>
          <span className="text-[10px] text-slate-400">En Firebase Auth</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <Globe className="w-4 h-4 text-indigo-400" /> Sitios Web en React
          </span>
          <p className="text-2xl font-black text-white font-mono">{globalTenants.length}</p>
          <span className="text-[10px] text-blue-400">nexai-web-builder</span>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-1">
          <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <Wifi className="w-4 h-4 text-amber-400" /> Estado Inferencia IA
          </span>
          <p
            className={`text-base font-black font-mono truncate ${
              aiStatus === 'online' ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {aiStatus === 'online' ? 'VPS CPU (Qwen 1.5B) Activa' : 'Desconectado'}
          </p>
          <span className="text-[10px] text-slate-400 font-mono">{aiStatusMessage}</span>
        </div>
      </div>

      {/* Centralized API Keys Manager */}
      <Card className="border-amber-500/30 bg-slate-900 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm">Gestor Centralizado de Inferencia IA (Sincronizado vía Firestore)</CardTitle>
                <CardDescription>
                  Configura la URL de Servidor IA Local o tu clave de Groq para alimentar la IA de todo el ecosistema.
                </CardDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => checkAiServer(colabUrl)}
              isLoading={aiStatus === 'checking'}
              leftIcon={<RefreshCw className="w-3.5 h-3.5 text-amber-400" />}
            >
              Re-testear Inferencia
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveMasterKeys} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="URL de Servidor IA Local (Cloudflare Tunnel - VPS CPU (Qwen 1.5B))"
                value={colabUrl}
                onChange={(e) => setColabUrl(e.target.value)}
                placeholder="https://xxxx.trycloudflare.com"
              />
              <Input
                label="Groq API Key de Respaldo 24/7 (Opcional)"
                type="password"
                value={groqKey}
                onChange={(e) => setGroqKey(e.target.value)}
                placeholder="gsk_xxxxxxxxxxxxxxxxxxxx"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" leftIcon={isKeysSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}>
                {isKeysSaved ? '¡Claves Maestras Sincronizadas!' : 'Guardar y Sincronizar Ecosistema'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Registered Tenants / Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Empresas & Clientes Registrados</CardTitle>
          <CardDescription>Directorio de empresas reales registradas en la base de datos.</CardDescription>
        </CardHeader>
        <CardContent>
          {globalTenants.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              Aún no hay clientes registrados en la plataforma.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Empresa / Cliente</th>
                    <th className="py-3 px-4">Rubro</th>
                    <th className="py-3 px-4">Plan SaaS</th>
                    <th className="py-3 px-4">Sitio Web</th>
                    <th className="py-3 px-4 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {globalTenants.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
                          {t.name?.substring(0, 1) || 'E'}
                        </div>
                        <span>{t.name}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 capitalize">{t.industry || 'Comercio'}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono font-bold text-[10px]">
                          {t.plan?.toUpperCase() || 'TRIAL'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <a
                          href={`https://nexai-web-builder.vercel.app/sites/${t.slug || 'kiras-pizza'}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                        >
                          <span>/sites/{t.slug || 'kiras-pizza'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-bold">
                          ACTIVO
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
