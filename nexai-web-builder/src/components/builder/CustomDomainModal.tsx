'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Globe, CheckCircle2, ShieldCheck, Copy, Check } from 'lucide-react';

export const CustomDomainModal: React.FC<{ isOpen: boolean; onClose: () => void; businessName: string }> = ({
  isOpen, onClose, businessName,
}) => {
  const [domain, setDomain] = useState('www.kiraspizza.pe');
  const [isCopied, setIsCopied] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Conectar Dominio Personalizado (.pe / .com)" description="Usa tu propio dominio web con certificado SSL automático de alta seguridad." maxWidth="md">
      <div className="space-y-4 text-xs">
        <Input label="Tu Nombre de Dominio" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="ej. www.tuempresa.pe" />
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
          <span className="font-bold text-slate-200">Configuración DNS Requerida en tu Proveedor:</span>
          <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg font-mono text-[11px] text-blue-400">
            <span>Tipo: CNAME | Host: www | Valor: cname.nexai.pe</span>
            <button onClick={() => handleCopy('cname.nexai.pe')} className="p-1 hover:text-white">
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
          <ShieldCheck className="w-4 h-4" /> Certificado SSL Let's Encrypt aprovisionado automáticamente.
        </div>
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={() => { setIsVerified(true); setTimeout(onClose, 1500); }}>
            {isVerified ? '¡Dominio Verificado!' : 'Verificar DNS'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
