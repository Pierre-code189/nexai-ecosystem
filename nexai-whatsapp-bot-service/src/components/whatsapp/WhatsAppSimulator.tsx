'use client';

import React, { useState } from 'react';
import { useWhatsAppBot } from '@/context/WhatsAppBotContext';
import { useTenant } from '@/context/TenantContext';
import { Send, Bot, Sparkles, User, CheckCheck, Loader2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const WhatsAppSimulator: React.FC = () => {
  const { currentTenant, currentPreset } = useTenant();
  const {
    chats,
    activeChatId,
    activeMessages,
    setActiveChatId,
    sendSimulatedUserMessage,
    sendAgentReply,
    isAiTyping,
    createNewChat,
  } = useWhatsAppBot();

  const [inputMessage, setInputMessage] = useState('');
  const [simulationMode, setSimulationMode] = useState<'client' | 'agent'>('client');

  const activeChat = chats.find((c) => c.id === activeChatId);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const text = inputMessage.trim();
    setInputMessage('');

    if (simulationMode === 'client') {
      await sendSimulatedUserMessage(text);
    } else {
      await sendAgentReply(text);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl h-[580px]">
      {/* Chats Sidebar */}
      <div className="bg-slate-900/70 border-r border-slate-800 flex flex-col">
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-100 uppercase tracking-wider">Chats Activos</span>
          <button
            onClick={() => {
              const name = prompt('Nombre del nuevo cliente WhatsApp:');
              if (name) createNewChat('+51 9' + Math.floor(10000000 + Math.random() * 90000000), name);
            }}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
          >
            + Nuevo Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
          {chats.map((chat) => {
            const isSelected = chat.id === activeChatId;
            return (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`p-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-slate-800/90 border-l-4 border-blue-500' : 'hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">{chat.contactName}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{formatDate(chat.lastMessageTime)}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-1">{chat.lastMessage}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-slate-500 font-mono">{chat.phoneNumber}</span>
                  {chat.isAiEnabled && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> IA Activa
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Thread */}
      <div className="col-span-2 flex flex-col bg-slate-950">
        {/* Chat Header */}
        <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-100 flex items-center gap-2">
              {activeChat?.contactName || 'Selecciona un chat'}
              <span className="text-[10px] font-normal text-slate-400">({activeChat?.phoneNumber})</span>
            </h4>
            <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Bot IA listo para responder con contexto: {currentPreset.name.split(' ')[0]}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400">Enviar como:</span>
            <div className="flex bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setSimulationMode('client')}
                className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                  simulationMode === 'client' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Cliente (Simular)
              </button>
              <button
                type="button"
                onClick={() => setSimulationMode('agent')}
                className={`px-2 py-1 rounded text-[10px] font-semibold transition-all ${
                  simulationMode === 'agent' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Agente Humano
              </button>
            </div>
          </div>
        </div>

        {/* Message Bubble List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
          {activeMessages.map((msg) => {
            const isUser = msg.sender === 'user';
            const isBot = msg.sender === 'bot';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-start' : 'items-end'} animate-in fade-in duration-150`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-md ${
                    isUser
                      ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                      : isBot
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-blue-500/10'
                      : 'bg-emerald-700 text-white rounded-tr-none'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] font-bold opacity-75 mb-1">
                    {isUser ? (
                      <>
                        <User className="w-3 h-3" /> Cliente
                      </>
                    ) : isBot ? (
                      <>
                        <Sparkles className="w-3 h-3" /> Asistente IA
                      </>
                    ) : (
                      'Agente Asesor'
                    )}
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 text-[9px] opacity-60 mt-1 font-mono">
                    <span>{formatDate(msg.timestamp)}</span>
                    <CheckCheck className="w-3 h-3 text-cyan-300" />
                  </div>
                </div>
              </div>
            );
          })}

          {isAiTyping && (
            <div className="flex items-center gap-2 text-xs text-blue-400 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 w-fit">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>La IA está redactando la respuesta...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            placeholder={
              simulationMode === 'client'
                ? 'Escribe como cliente (ej. "¿Cuánto cuesta?", "¿Tienen visitas este sábado?")...'
                : 'Escribe una respuesta manual como agente...'
            }
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            className="flex-1 px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-[var(--color-primary,#3b82f6)]"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="px-4 py-2 bg-[var(--color-primary,#3b82f6)] hover:opacity-90 disabled:opacity-50 text-white rounded-xl font-medium text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Enviar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
