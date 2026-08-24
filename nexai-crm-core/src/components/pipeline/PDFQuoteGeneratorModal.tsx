'use client';

import React, { useState } from 'react';
import { PipelineDeal } from '@/types/crm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Download, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useTenant } from '@/context/TenantContext';

export interface PDFQuoteGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDeal?: PipelineDeal | null;
  dealTitle?: string;
  dealValue?: number;
  contactName?: string;
  currency?: string;
}

export const PDFQuoteGeneratorModal: React.FC<PDFQuoteGeneratorModalProps> = ({
  isOpen,
  onClose,
  selectedDeal,
  dealTitle: propTitle,
  dealValue: propValue,
  contactName: propContact,
  currency: propCurrency,
}) => {
  const { currentTenant } = useTenant();
  const [quoteNumber] = useState(`COT-2026-${Math.floor(1000 + Math.random() * 9000)}`);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const title = selectedDeal?.title || propTitle || 'Servicios Profesionales';
  const value = selectedDeal ? Number(selectedDeal.value) || 0 : propValue || 0;
  const contact = selectedDeal?.contactName || propContact || 'Cliente';
  const currency = propCurrency || currentTenant?.currency || 'PEN';

  const handleDownloadPDF = () => {
    const htmlDoc = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="utf-8">
        <title>Cotización ${quoteNumber} - ${currentTenant.name}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; max-width: 700px; margin: auto; }
          .header { border-bottom: 2px solid #3b82f6; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; }
          .title { color: #1e40af; font-size: 24px; font-weight: 800; margin: 0; }
          .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin: 20px 0; }
          .total { font-size: 22px; font-weight: 800; color: #059669; margin-top: 16px; text-align: right; }
          .footer { font-size: 11px; color: #64748b; text-align: center; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">${currentTenant.name}</h1>
            <p style="margin: 4px 0; font-size: 13px; color: #64748b;">RUC / Identificación: 20608945123</p>
          </div>
          <div style="text-align: right; font-size: 12px;">
            <p><strong>N° Proforma:</strong> ${quoteNumber}</p>
            <p><strong>Fecha de Emisión:</strong> ${new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div class="box">
          <p><strong>Cliente:</strong> ${contact}</p>
          <p><strong>Concepto / Detalle Comercial:</strong> ${title}</p>
          <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 16px 0;" />
          <div class="total">Total a Pagar: ${formatCurrency(value, currency)}</div>
        </div>

        <p style="font-size: 12px; line-height: 1.5; color: #475569;">
          • Validez de la oferta: 15 días calendario a partir de la fecha de emisión.<br/>
          • Medios de pago habilitados: Yape, Plin, Transferencia BCP y Tarjeta.<br/>
          • Para confirmar la aceptación de esta propuesta, comuníquese con su asesor asignado.
        </p>

        <div class="footer">
          Documento digital generado automáticamente por la plataforma NexAI CRM Universal.
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${quoteNumber}_${contact.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsDownloaded(true);
    setTimeout(() => setIsDownloaded(false), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generar Cotización Formal en PDF"
      description="Emisión rápida de proforma vinculada a la oportunidad comercial."
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">N° Cotización:</span>
            <span className="font-mono font-bold text-blue-400">{quoteNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Cliente:</span>
            <span className="font-bold text-slate-200">{contact}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Concepto:</span>
            <span className="font-bold text-slate-200 truncate max-w-[200px]">{title}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-900">
            <span className="text-slate-400">Monto Total:</span>
            <span className="font-mono font-bold text-emerald-400 text-sm">{formatCurrency(value, currency)}</span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={handleDownloadPDF}
            leftIcon={isDownloaded ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
          >
            {isDownloaded ? '¡Cotización Descargada!' : 'Descargar Cotización (HTML/PDF)'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
