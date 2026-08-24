'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Sparkles, CheckCircle2, Zap } from 'lucide-react';

export interface WebsiteUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmConnectCRM?: () => void;
  businessName?: string;
}

export const WebsiteUpsellModal: React.FC<WebsiteUpsellModalProps> = ({
  isOpen,
  onClose,
  onConfirmConnectCRM,
  businessName = 'Tu Negocio',
}) => {
  const handleConnect = () => {
    if (onConfirmConnectCRM) {
      onConfirmConnectCRM();
    } else {
      window.location.href = 'http://82.39.109.192:3001/dashboard';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🚀 Potencia tu Sitio Web con CRM Universal"
      description="Convierte a los visitantes de tu web en clientes recurrentes con atención 24/7."
      maxWidth="xl"
    >
      <div className="space-y-6">
        <div className="p-4 bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
            Integración de 1 Clic para {businessName}
          </div>
          <h3 className="text-base font-black text-slate-100">
            ¿Por qué conectar tu nueva web con el CRM Universal?
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Captura Automática de Prospectos:</strong> Cada formulario de contacto se inserta de inmediato en tu embudo de ventas Kanban.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Bot de WhatsApp IA Vinculado:</strong> Respuestas inteligentes 24/7 por WhatsApp para calificar compras, citas y consultas.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong>Cascarón Dinámico Inteligente:</strong> Campos y etapas adaptados automáticamente a tu rubro.</span>
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-center">
            <span className="text-slate-400">Plan Web Básico</span>
            <div className="text-lg font-black text-slate-200">Pago Único</div>
            <p className="text-[11px] text-slate-500">Solo código web y hosting</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-950 to-slate-900 border border-blue-500/40 rounded-xl space-y-1 text-center relative">
            <span className="absolute -top-2 right-3 text-[9px] px-2 py-0.5 bg-blue-500 text-white font-bold rounded-full">
              RECOMENDADO
            </span>
            <span className="text-blue-400 font-bold">Web + CRM Pro</span>
            <div className="text-lg font-black text-emerald-400">14 Días Gratis</div>
            <p className="text-[11px] text-slate-400">Luego suscripción recurrente</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
          <Button variant="outline" onClick={onClose}>
            Solo descargar Web
          </Button>
          <Button variant="primary" onClick={handleConnect} leftIcon={<Zap className="w-4 h-4" />}>
            Activar CRM Universal & WhatsApp Bot
          </Button>
        </div>
      </div>
    </Modal>
  );
};
