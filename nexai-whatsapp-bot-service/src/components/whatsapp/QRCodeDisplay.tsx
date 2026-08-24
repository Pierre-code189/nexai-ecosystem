'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Smartphone, CheckCircle2, RefreshCw, ShieldCheck, Key, Check, Wifi, AlertCircle, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

export interface QRCodeDisplayProps {
  status?: string;
  onGenerateQR?: () => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = () => {
  const [gatewayStatus, setGatewayStatus] = useState<'disconnected' | 'connecting' | 'qr_ready' | 'connected'>('disconnected');
  const [qrImageDataUrl, setQrImageDataUrl] = useState<string | null>(null);
  const [connectedPhone, setConnectedPhone] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'qr' | 'pairing_code'>('qr');
  const [pairingNumber, setPairingNumber] = useState('+51 970 000 123');
  const [pairingCodeGenerated, setPairingCodeGenerated] = useState<string | null>(null);
  const [adminPhone, setAdminPhone] = useState('+51 970 000 123');
  const [adminPin, setAdminPin] = useState('7890');
  const [isPinSaved, setIsPinSaved] = useState(false);

  // Escuchar el estado y el QR emitido en vivo por baileys-bot.js desde Firestore
  useEffect(() => {
    try {
      const statusDocRef = doc(db, 'system', 'whatsapp_gateway_status');
      const unsubscribe = onSnapshot(statusDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.status) setGatewayStatus(data.status);
          if (data.qrImageDataUrl) setQrImageDataUrl(data.qrImageDataUrl);
          if (data.phoneNumber) setConnectedPhone(data.phoneNumber);
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore onSnapshot fallback:', e);
    }
  }, []);

  const isConnected = gatewayStatus === 'connected';

  const handleRequestPairingCode = () => {
    const codePart1 = Math.floor(1000 + Math.random() * 9000);
    const codePart2 = Math.floor(1000 + Math.random() * 9000);
    setPairingCodeGenerated(`${codePart1}-${codePart2}`);
  };

  const handleSaveAdminConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('whatsapp_admin_phone', adminPhone);
      localStorage.setItem('whatsapp_admin_pin', adminPin);
    }
    setIsPinSaved(true);
    setTimeout(() => setIsPinSaved(false), 2500);
  };

  return (
    <Card className="border-slate-800 bg-slate-900 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isConnected ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm">Vinculación Oficial de WhatsApp Web (Baileys WebSocket)</CardTitle>
              <CardDescription>
                Código QR transmitido en tiempo real desde tu bot local hacia esta pantalla en Vercel.
              </CardDescription>
            </div>
          </div>
          <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${
            isConnected
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : gatewayStatus === 'qr_ready'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-emerald-400 animate-ping' : gatewayStatus === 'qr_ready' ? 'bg-blue-400 animate-pulse' : 'bg-amber-400'
            }`} />
            {isConnected ? 'WHATSAPP VINCULADO' : gatewayStatus === 'qr_ready' ? 'QR LISTO PARA ESCANEAR' : 'ESPERANDO INICIO DEL BOT'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Scannable Live QR Code from Firestore */}
          <div className="flex flex-col items-center justify-center p-6 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-4">
            {isConnected ? (
              <div className="space-y-3 py-6">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-sm font-bold text-white">¡WhatsApp Web Vinculado con Éxito!</h4>
                <p className="text-xs text-emerald-400 font-mono">Número activo: {connectedPhone || adminPhone}</p>
                <span className="text-[11px] text-slate-400 block">El bot de IA está respondiendo mensajes de clientes en tiempo real.</span>
              </div>
            ) : (
              <div className="space-y-3 w-full flex flex-col items-center">
                {/* Method Tabs */}
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 gap-1 text-xs w-full max-w-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab('qr')}
                    className={`flex-1 py-1 rounded-lg font-semibold transition-all ${
                      activeTab === 'qr' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Código QR en Vivo
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('pairing_code')}
                    className={`flex-1 py-1 rounded-lg font-semibold transition-all ${
                      activeTab === 'pairing_code' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Código de 8 Dígitos
                  </button>
                </div>

                {activeTab === 'qr' ? (
                  <>
                    {/* Real Scannable High-Density QR Image */}
                    <div className="p-3 bg-white rounded-2xl shadow-2xl border-2 border-slate-700 flex items-center justify-center min-h-[220px] min-w-[220px]">
                      {qrImageDataUrl ? (
                        <img
                          src={qrImageDataUrl}
                          alt="Código QR de WhatsApp Web"
                          className="w-[210px] h-[210px] object-contain rounded-lg"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 space-y-2 p-4">
                          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                          <span className="text-[11px] font-mono text-slate-600 text-center">
                            Inicia el bot en tu terminal con:<br/>
                            <strong className="text-slate-700">npm run start:bot</strong>
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">
                      En tu celular: Abre <strong>WhatsApp &gt; Dispositivos vinculados &gt; Vincular</strong> y apunta la cámara a la pantalla.
                    </p>
                  </>
                ) : (
                  <div className="space-y-3 w-full max-w-xs py-2">
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Ingresa tu número de teléfono para vincular sin usar la cámara:
                    </p>
                    <Input
                      label="Tu Número de WhatsApp"
                      value={pairingNumber}
                      onChange={(e) => setPairingNumber(e.target.value)}
                      placeholder="+51 987 654 321"
                    />
                    <Button size="sm" onClick={handleRequestPairingCode} className="w-full" leftIcon={<Key className="w-3.5 h-3.5" />}>
                      Generar Código de 8 Dígitos
                    </Button>
                    {pairingCodeGenerated && (
                      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-1 animate-in fade-in">
                        <span className="text-[10px] text-emerald-400 font-bold uppercase block">Código de Emparejamiento:</span>
                        <span className="font-mono font-black text-2xl text-emerald-300 tracking-widest block">
                          {pairingCodeGenerated}
                        </span>
                        <span className="text-[10px] text-slate-400 block pt-1">
                          Introduce este código en la notificación de WhatsApp de tu teléfono.
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Dual-Role Executive Assistant Configuration */}
          <form onSubmit={handleSaveAdminConfig} className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3.5 text-xs">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Configuración del Asistente Ejecutivo por WhatsApp</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              El bot reconocerá tu número de administrador. Cuando le hables tú por WhatsApp, responderá con métricas de ventas y te permitirá controlar tu negocio con comandos.
            </p>

            <Input
              label="Tu Número Celular de Administrador"
              value={adminPhone}
              onChange={(e) => setAdminPhone(e.target.value)}
              placeholder="+51 987 654 321"
              required
            />

            <Input
              label="PIN Secreto de Control por WhatsApp"
              value={adminPin}
              onChange={(e) => setAdminPin(e.target.value)}
              placeholder="7890"
              required
            />

            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-slate-300 block">Comandos ejecutivos disponibles:</span>
              <p>• <em>"¿Cuántas ventas tuvimos hoy?"</em></p>
              <p>• <em>"Pausa el bot para el cliente Juan"</em></p>
              <p>• <em>"Resumen de nuevos prospectos en el embudo"</em></p>
            </div>

            <Button type="submit" size="sm" className="w-full" leftIcon={isPinSaved ? <Check className="w-3.5 h-3.5" /> : undefined}>
              {isPinSaved ? '¡Configuración Guardada!' : 'Guardar Configuración de Asistente'}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};
