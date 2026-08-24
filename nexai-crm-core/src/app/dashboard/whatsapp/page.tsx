'use client';

import React, { useState, useEffect } from 'react';
import { QRCodeDisplay } from '@/components/whatsapp/QRCodeDisplay';
import { VoiceNoteRecorder } from '@/components/whatsapp/VoiceNoteRecorder';
import { MultiAgentManager } from '@/components/whatsapp/MultiAgentManager';
import { PaymentGeneratorModal } from '@/components/payments/PaymentGeneratorModal';
import { PaymentQRUploadManager } from '@/components/payments/PaymentQRUploadManager';
import { useWhatsAppBot } from '@/context/WhatsAppBotContext';
import { useTenant } from '@/context/TenantContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MessageSquare, Bot, QrCode, CreditCard, Sparkles, Save, Check } from 'lucide-react';

export default function WhatsAppHubPage() {
  const { sessionState, isAiTyping } = useWhatsAppBot();
  const { currentTenant, updateTenant } = useTenant();

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState(currentTenant?.whatsappBotPrompt || '');
  const [isPromptSaved, setIsPromptSaved] = useState(false);

  useEffect(() => {
    if (currentTenant?.whatsappBotPrompt) {
      setSystemPrompt(currentTenant.whatsappBotPrompt);
    }
  }, [currentTenant?.whatsappBotPrompt]);

  const handleSavePrompt = async () => {
    await updateTenant({ whatsappBotPrompt: systemPrompt });
    setIsPromptSaved(true);
    setTimeout(() => setIsPromptSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-3xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-100 tracking-tight">
                Consola Oficial de WhatsApp Web & Asistente IA
              </h1>
              <p className="text-xs text-slate-400">
                Vinculación real mediante código QR con protocolo Baileys Multi-Device.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="success"
            size="sm"
            onClick={() => setIsPaymentModalOpen(true)}
            leftIcon={<CreditCard className="w-3.5 h-3.5" />}
          >
            Generar Cobro Yape / Plin
          </Button>
        </div>
      </div>

      {/* 1. Main QR Code Display & Pairing */}
      <QRCodeDisplay />

      {/* 2. Bot System Prompt Tuning */}
      <Card className="border-slate-800 bg-slate-900 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-blue-400" />
              <CardTitle className="text-sm">Instrucciones Comerciales del Bot de IA (System Prompt)</CardTitle>
            </div>
            <Button
              size="sm"
              onClick={handleSavePrompt}
              leftIcon={isPromptSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            >
              {isPromptSaved ? '¡Guardado!' : 'Guardar Prompt'}
            </Button>
          </div>
          <CardDescription>
            Personaliza el comportamiento, saludo, catálogo de productos y reglas de venta que utilizará la IA.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={systemPrompt}
            onChange={(e) => setSystemPrompt(e.target.value)}
            rows={5}
            placeholder="Escribe las instrucciones del bot de ventas (ej. 'Eres el asistente comercial de Kira's Pizza. Saluda con entusiasmo, responde dudas sobre nuestra masa madre y ofrece nuestros combos familiares...')..."
            className="w-full p-4 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-none"
          />
        </CardContent>
      </Card>

      {/* 3. Audio & Multi-Agent Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VoiceNoteRecorder onSendVoiceNote={async () => {}} />
        <MultiAgentManager isAiEnabled={true} onToggleAi={() => {}} />
      </div>

      <PaymentGeneratorModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        customerName="Cliente WhatsApp"
        orderTotal={45.00}
        orderDescription="Orden comercial WhatsApp"
      />
    </div>
  );
}
