'use client';

import React, { useState } from 'react';
import { MultiAgent } from '@/types/advanced';
import { Users, Bot, PauseCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface MultiAgentManagerProps {
  currentChatId?: string;
  isAiEnabled: boolean;
  onToggleAi: () => void;
}

export const MultiAgentManager: React.FC<MultiAgentManagerProps> = ({
  currentChatId,
  isAiEnabled,
  onToggleAi,
}) => {
  const { user } = useAuth();
  const userName = user?.displayName || 'Asesor Principal';

  const [agents, setAgents] = useState<MultiAgent[]>([
    { id: 'ag_1', name: userName, email: user?.email || 'admin@empresa.pe', avatarUrl: '', role: 'admin', status: 'online', assignedChatsCount: 1 },
  ]);

  const [selectedAgentId, setSelectedAgentId] = useState('ag_1');

  return (
    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-200 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-blue-400" />
          Bandeja de Asesores & Handover
        </span>
        <button
          onClick={onToggleAi}
          className={`px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
            isAiEnabled
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}
        >
          {isAiEnabled ? (
            <>
              <Bot className="w-3 h-3" /> Bot IA Activo
            </>
          ) : (
            <>
              <PauseCircle className="w-3 h-3" /> Bot Pausado (Modo Humano)
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span className="text-slate-400 text-[11px]">Asesor en Turno:</span>
        <select
          value={selectedAgentId}
          onChange={(e) => setSelectedAgentId(e.target.value)}
          className="bg-slate-950 border border-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {agents.map((ag) => (
            <option key={ag.id} value={ag.id}>
              {ag.name} ({ag.role.toUpperCase()})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
