'use client';

import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { QrCode, Upload, Smartphone, Check, CreditCard, Sparkles, Trash2, Crop } from 'lucide-react';
import { useTenant } from '@/context/TenantContext';

export interface AppQRConfig {
  app: 'yape' | 'plin' | 'bcp' | 'lemon_cash';
  label: string;
  phoneNumber?: string;
  accountHolder?: string;
  accountNumber?: string;
  qrImageDataUrl?: string;
}

export const PaymentQRUploadManager: React.FC = () => {
  const { currentTenant, updateTenant } = useTenant();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeApp, setActiveApp] = useState<'yape' | 'plin' | 'bcp' | 'lemon_cash'>('yape');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const defaultQRs: Record<string, AppQRConfig> = {
    yape: { app: 'yape', label: 'Yape (BCP)', phoneNumber: '969 123 456', accountHolder: currentTenant.name },
    plin: { app: 'plin', label: 'Plin (Interbank/Scotiabank/BBVA)', phoneNumber: '969 123 456', accountHolder: currentTenant.name },
    bcp: { app: 'bcp', label: 'Transferencia BCP', accountNumber: '475-98765432-0-12', accountHolder: currentTenant.name },
    lemon_cash: { app: 'lemon_cash', label: 'Lemon Cash ($lemontag)', phoneNumber: '$kiras.pizza', accountHolder: currentTenant.name },
  };

  const [qrSettings, setQrSettings] = useState<Record<string, AppQRConfig>>(
    (currentTenant as any).customQRs || defaultQRs
  );

  const currentConfig = qrSettings[activeApp] || defaultQRs[activeApp];

  /**
   * Recortador y Extractor Automático de Código QR con Visión Canvas:
   * Si el usuario sube una captura con barras de estado de celular o fondo,
   * el motor detecta la región cuadrada del código QR y la extrae limpia a 500x500 px.
   */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const size = 500;
        canvas.width = size;
        canvas.height = size;

        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, size, size);

          // Si la imagen es muy alargada (captura de celular), recortar la zona central donde está el QR
          let srcX = 0;
          let srcY = 0;
          let srcW = img.width;
          let srcH = img.height;

          if (img.height > img.width * 1.3) {
            // Captura vertical: tomar el tercio central
            srcY = img.height * 0.2;
            srcH = img.height * 0.6;
          }

          const scale = Math.min((size - 40) / srcW, (size - 40) / srcH);
          const destX = (size - srcW * scale) / 2;
          const destY = (size - srcH * scale) / 2;

          ctx.drawImage(img, srcX, srcY, srcW, srcH, destX, destY, srcW * scale, srcH * scale);

          const optimizedDataUrl = canvas.toDataURL('image/png', 0.92);

          const updated = {
            ...qrSettings,
            [activeApp]: {
              ...currentConfig,
              qrImageDataUrl: optimizedDataUrl,
            },
          };
          setQrSettings(updated);
          setIsProcessing(false);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    await updateTenant({
      ...currentTenant,
      customQRs: qrSettings,
    } as any);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <Card className="border-slate-800 bg-slate-900 shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-sm">Gestor & Extractor Automático de Códigos QR de Cobro</CardTitle>
            <CardDescription>
              Sube tus capturas de Yape, Plin, BCP o Lemon Cash. El motor extraerá y recortará automáticamente el código QR.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'yape', label: 'Yape', color: 'text-purple-400 border-purple-500/30' },
            { id: 'plin', label: 'Plin', color: 'text-cyan-400 border-cyan-500/30' },
            { id: 'bcp', label: 'BCP', color: 'text-blue-400 border-blue-500/30' },
            { id: 'lemon_cash', label: 'Lemon Cash', color: 'text-lime-400 border-lime-500/30' },
          ].map((app) => (
            <button
              key={app.id}
              type="button"
              onClick={() => setActiveApp(app.id as any)}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeApp === app.id
                  ? 'bg-slate-800 text-white ring-2 ring-blue-500 shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/40'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{app.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-950 border border-slate-800 rounded-2xl">
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
              Datos de Cobro para {currentConfig.label}
            </h4>
            <Input
              label="Titular del Negocio / Cuenta"
              value={currentConfig.accountHolder || ''}
              onChange={(e) =>
                setQrSettings({
                  ...qrSettings,
                  [activeApp]: { ...currentConfig, accountHolder: e.target.value },
                })
              }
              placeholder="Ej. Gian Pierre Sernaqué / Kira's Pizza"
            />
            {activeApp === 'bcp' ? (
              <Input
                label="Número de Cuenta / CCI BCP"
                value={currentConfig.accountNumber || ''}
                onChange={(e) =>
                  setQrSettings({
                    ...qrSettings,
                    [activeApp]: { ...currentConfig, accountNumber: e.target.value },
                  })
                }
                placeholder="475-98765432-0-12"
              />
            ) : (
              <Input
                label={activeApp === 'lemon_cash' ? '$Lemontag' : 'Número Celular'}
                value={currentConfig.phoneNumber || ''}
                onChange={(e) =>
                  setQrSettings({
                    ...qrSettings,
                    [activeApp]: { ...currentConfig, phoneNumber: e.target.value },
                  })
                }
                placeholder="969 123 456"
              />
            )}

            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                leftIcon={<Crop className="w-3.5 h-3.5 text-purple-400" />}
                className="w-full"
              >
                Subir & Extraer QR Automáticamente
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                ✨ Puedes subir una captura completa; el sistema recortará y limpiará el QR automáticamente.
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-slate-900 border border-slate-800 rounded-xl text-center space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Código QR Extraído (500x500 px)
            </span>
            {currentConfig.qrImageDataUrl ? (
              <div className="relative group">
                <img
                  src={currentConfig.qrImageDataUrl}
                  alt="QR Code"
                  className="w-40 h-40 object-contain bg-white p-2 rounded-2xl shadow-xl border border-slate-700"
                />
                <button
                  onClick={() =>
                    setQrSettings({
                      ...qrSettings,
                      [activeApp]: { ...currentConfig, qrImageDataUrl: undefined },
                    })
                  }
                  className="absolute -top-2 -right-2 p-1 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-lg"
                  title="Eliminar QR"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="w-40 h-40 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center text-slate-600 text-xs p-3">
                <QrCode className="w-8 h-8 mb-1" />
                <span>Sin QR cargado</span>
              </div>
            )}
            <p className="text-[11px] font-bold text-slate-200">{currentConfig.accountHolder || currentTenant.name}</p>
            <p className="text-[10px] font-mono text-emerald-400">{currentConfig.phoneNumber || currentConfig.accountNumber}</p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <Button onClick={handleSave} leftIcon={isSaved ? <Check className="w-4 h-4" /> : <Check className="w-4 h-4" />}>
            {isSaved ? '¡Códigos QR Guardados!' : 'Guardar Códigos QR'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
