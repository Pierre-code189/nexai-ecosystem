'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PaymentQRUploadManager } from '@/components/payments/PaymentQRUploadManager';
import { Database, Wifi, Save, Check, Play, RefreshCw, Sparkles, Cloud } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, limit, query, doc, getDoc, setDoc } from 'firebase/firestore';

export default function SettingsPage() {
  const [colabUrl, setColabUrl] = useState('');
  const [isColabSaved, setIsColabSaved] = useState(false);
  const [colabTestStatus, setColabTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [colabTestMessage, setColabTestMessage] = useState('');

  const [dbTestStatus, setDbTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [dbTestMessage, setDbTestMessage] = useState('');

  // Cargar URL activa desde Firestore al entrar
  useEffect(() => {
    async function loadCloudConfig() {
      try {
        const configSnap = await getDoc(doc(db, 'system', 'ai_server_config'));
        if (configSnap.exists()) {
          const data = configSnap.data();
          if (data.ollamaApiUrl) {
            setColabUrl(data.ollamaApiUrl);
            if (typeof window !== 'undefined') {
              localStorage.setItem('colab_ollama_url', data.ollamaApiUrl);
            }
            return;
          }
        }
      } catch (e) {
        console.warn('Firestore ai_server_config fetch fallback:', e);
      }

      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('colab_ollama_url');
        if (saved) setColabUrl(saved);
      }
    }
    loadCloudConfig();
  }, []);

  const handleSaveColabUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = colabUrl.trim();

    if (typeof window !== 'undefined') {
      localStorage.setItem('colab_ollama_url', cleanUrl);
    }

    // Auto-Sincronización Cloud con Firestore (El bot local lo recibe al instante)
    try {
      await setDoc(doc(db, 'system', 'ai_server_config'), {
        ollamaApiUrl: cleanUrl,
        modelName: 'qwen2.5:1.5b',
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.warn('Error guardando en Firestore:', e);
    }

    setIsColabSaved(true);
    setTimeout(() => setIsColabSaved(false), 2500);
  };

  /**
   * Test Real a través del Endpoint Backend Serverless /api/ai/ping
   */
  const handleTestColab = async () => {
    setColabTestStatus('testing');
    setColabTestMessage('Verificando conexión con Ollama VPS Local...');
    try {
      const res = await fetch('/api/ai/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: colabUrl.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setColabTestStatus('success');
        setColabTestMessage(`✅ ${data.message}`);

        // Si fue exitoso, auto-persistir en Firestore para que el bot de WhatsApp se actualice solo
        try {
          await setDoc(doc(db, 'system', 'ai_server_config'), {
            ollamaApiUrl: colabUrl.trim(),
            modelName: 'qwen2.5:1.5b',
            status: 'online',
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        } catch {}
      } else {
        setColabTestStatus('error');
        setColabTestMessage(`⚠️ ${data.error || 'No se pudo conectar con Colab. Verifica que la celda esté activa.'}`);
      }
    } catch (err: any) {
      setColabTestStatus('error');
      setColabTestMessage(`❌ Error de conexión: ${err.message}`);
    }
  };

  /**
   * Test Real hacia Firebase Firestore
   */
  const handleTestDatabase = async () => {
    setDbTestStatus('testing');
    setDbTestMessage('Consultando colecciones en Firebase Firestore...');
    try {
      const q = query(collection(db, 'tenants'), limit(1));
      await getDocs(q);
      setDbTestStatus('success');
      setDbTestMessage('✅ ¡Conexión Exitosa con Firebase Firestore (nexai-crm-database)!');
    } catch (err: any) {
      setDbTestStatus('error');
      setDbTestMessage(`⚠️ Error de Firestore: ${err.message || 'Verifica permisos de base de datos'}`);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-black text-slate-100 tracking-tight">
          Conexiones en Vivo, Servidor de IA & Base de Datos
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Comprueba y administra las conexiones reales con Ollama VPS Local, Firebase Firestore y tus QRs de cobro.
        </p>
      </div>

      {/* Gestor de QRs de Cobro */}
      <PaymentQRUploadManager />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dynamic Colab URL Input & Real Test with Auto-Sync */}
        <Card className="border-blue-500/40 bg-slate-900/90 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <CardTitle className="text-sm">Servidor de IA en Servidor IA Local (VPS CPU (Qwen 1.5B))</CardTitle>
                  <CardDescription>Auto-sincronizado con Firestore y tu Bot de WhatsApp.</CardDescription>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono flex items-center gap-1 font-bold">
                <Cloud className="w-3 h-3" /> Auto-Sync Cloud
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <form onSubmit={handleSaveColabUrl} className="space-y-3">
              <Input
                label="URL Pública de Cloudflare Tunnel"
                value={colabUrl}
                onChange={(e) => setColabUrl(e.target.value)}
                placeholder="https://xxxx.trycloudflare.com"
                required
              />
              <div className="flex justify-between items-center gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTestColab}
                  isLoading={colabTestStatus === 'testing'}
                  leftIcon={<Play className="w-3.5 h-3.5 text-emerald-400" />}
                >
                  Probar Conexión GPU
                </Button>
                <Button type="submit" size="sm" leftIcon={isColabSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}>
                  {isColabSaved ? '¡Guardada y Sincronizada!' : 'Guardar y Sincronizar'}
                </Button>
              </div>
            </form>

            {colabTestMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-mono border ${
                  colabTestStatus === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}
              >
                {colabTestMessage}
              </div>
            )}

            <p className="text-[11px] text-slate-500">
              ⚡ Al guardar una nueva URL, el bot de WhatsApp en tu laptop la actualizará automáticamente sin necesidad de editar archivos.
            </p>
          </CardContent>
        </Card>

        {/* Firebase DB Config & Real Test */}
        <Card className="border-amber-500/30 bg-slate-900/90 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm">Base de Datos Firebase Firestore</CardTitle>
                <CardDescription>Persistencia centralizada en tiempo real.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-200">ID del Proyecto</span>
                <p className="text-[11px] text-amber-400 font-mono">nexai-crm-database</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestDatabase}
                isLoading={dbTestStatus === 'testing'}
                leftIcon={<RefreshCw className="w-3.5 h-3.5 text-amber-400" />}
              >
                Verificar Firestore
              </Button>
            </div>

            {dbTestMessage && (
              <div
                className={`p-3 rounded-xl text-xs font-mono border ${
                  dbTestStatus === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}
              >
                {dbTestMessage}
              </div>
            )}

            <p className="text-xs text-slate-400 leading-relaxed">
              Tus contactos, tratos del Kanban y mensajes se almacenan de forma segura bajo el proyecto <code>nexai-crm-database</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
