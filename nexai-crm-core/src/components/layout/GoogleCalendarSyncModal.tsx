'use client';
import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Calendar, CheckCircle2, RefreshCw } from 'lucide-react';

export const GoogleCalendarSyncModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [isSynced, setIsSynced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSync = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSynced(true);
      setTimeout(onClose, 1500);
    }, 1200);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sincronizar Citas con Google Calendar" description="Vincula tu calendario para agendar visitas y citas automáticamente desde el CRM." maxWidth="md">
      <div className="space-y-4 text-xs text-center py-2">
        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
          <Calendar className="w-7 h-7" />
        </div>
        <p className="text-slate-300">Evita cruces de horarios y recibe recordatorios en tu celular cuando un cliente agende cita en WhatsApp.</p>
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleSync} isLoading={isLoading} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            {isSynced ? '¡Sincronizado!' : 'Conectar Google Calendar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
