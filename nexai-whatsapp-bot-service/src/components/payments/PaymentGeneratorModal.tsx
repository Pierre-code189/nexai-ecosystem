'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { QrCode, Smartphone, CreditCard, Send } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useTenant } from '@/context/TenantContext';

export interface PaymentGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendPaymentToChat?: (paymentText: string) => void;
  customerName?: string;
  defaultAmount?: number;
  orderTotal?: number;
  orderDescription?: string;
  currency?: string;
}

export const PaymentGeneratorModal: React.FC<PaymentGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSendPaymentToChat,
  customerName = 'Cliente WhatsApp',
  defaultAmount,
  orderTotal,
  orderDescription,
  currency: propCurrency,
}) => {
  const { currentTenant } = useTenant();
  const currency = propCurrency || currentTenant?.currency || 'PEN';
  const initialAmount = orderTotal || defaultAmount || 45.00;

  const [amount, setAmount] = useState<number>(initialAmount);
  const [method, setMethod] = useState<'yape' | 'plin' | 'bcp' | 'stripe'>('yape');
  const [concept, setConcept] = useState(orderDescription || 'Orden de Compra / Servicio');

  useEffect(() => {
    if (orderTotal) setAmount(orderTotal);
    if (orderDescription) setConcept(orderDescription);
  }, [orderTotal, orderDescription]);

  const handleSend = () => {
    let text = `💳 *INFORMACIÓN DE PAGO*\nEstimado/a ${customerName},\n\n*Concepto:* ${concept}\n*Monto a pagar:* ${formatCurrency(amount, currency)}\n`;

    if (method === 'yape') {
      text += `\n📲 *Yape:* Realizar pago al número registrado y enviar comprobante.`;
    } else if (method === 'plin') {
      text += `\n📲 *Plin:* Enviar la constancia de transferencia para confirmar.`;
    } else if (method === 'bcp') {
      text += `\n🏦 *Transferencia BCP:* Enviar constancia de abono.`;
    } else {
      text += `\n🔗 *Link de Pago Seguro (Tarjeta de Crédito / Débito)*`;
    }

    if (onSendPaymentToChat) {
      onSendPaymentToChat(text);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generar Cobro Rápido (Yape / Plin / BCP)"
      description="Emisión de orden de cobro vinculada a la empresa."
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label={`Monto (${currency})`}
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
          />
          <Input
            label="Concepto / Detalle"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-slate-300">Método de Cobro</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'yape', label: 'Yape (QR / Teléfono)', icon: Smartphone },
              { id: 'plin', label: 'Plin', icon: Smartphone },
              { id: 'bcp', label: 'Transferencia BCP', icon: QrCode },
              { id: 'stripe', label: 'Tarjeta de Crédito', icon: CreditCard },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all ${
                    method === m.id
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 ring-1 ring-blue-500'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <Button variant="outline" type="button" onClick={onClose}>
            Cerrar
          </Button>
          <Button variant="primary" type="button" onClick={handleSend} leftIcon={<Send className="w-3.5 h-3.5" />}>
            Generar Datos de Pago
          </Button>
        </div>
      </div>
    </Modal>
  );
};
