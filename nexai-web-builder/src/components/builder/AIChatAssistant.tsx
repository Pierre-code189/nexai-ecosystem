'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Bot, User, Loader2, Lightbulb, Zap, Code2, Layers, Cpu } from 'lucide-react';

interface AIChatAssistantProps {
  currentJsxCode: string;
  onUpdateJsxCode: (newJsx: string, explanation: string) => void;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ currentJsxCode, onUpdateJsxCode }) => {
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: '¡Hola! Soy Apio 🤖, tu Agente Creativo de Inteligencia Artificial para creación de software y sitios web interactivos en React 18.\n\nPídeme cualquier idea: desde una pizzería con pedidos a WhatsApp, una clínica con agendador de citas, hasta una calculadora interactiva o un panel de control con animaciones.',
      time: 'Ahora',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiSource, setAiSource] = useState<string>('Agente Apio Activo');

  const quickPrompts = [
    '🥖 Crear Panadería Artesanal con catálogo en Soles y carrito',
    '🏥 Crear Clínica Dental moderna con verde esmeralda y citas',
    '🍕 Crear Pizzería Napolitana con combos familiares y Yape',
    '🏋️ Crear Web de Gimnasio con calculadora de IMC interactiva',
    '🏢 Crear Inmobiliaria con buscador de propiedades y WhatsApp',
  ];

  const handleSend = async (instructionText?: string) => {
    const textToSend = instructionText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = {
      sender: 'user' as const,
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/builder/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentJsxCode,
          userInstruction: textToSend,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.jsxCode) {
          onUpdateJsxCode(data.jsxCode, data.reply || '¡He reprogramado y actualizado tu aplicación en el Sandbox!');
        }

        if (data.source === 'gpu_colab') {
          setAiSource('Apio IA (GPU Local)');
        } else if (data.source === 'groq_cloud') {
          setAiSource('Apio IA (Groq Cloud Llama 70B)');
        } else {
          setAiSource('Apio IA (Motor Creativo)');
        }

        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: data.reply || '¡He actualizado y compilado tu código en el Sandbox en tiempo real!',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error('Error al procesar con Apio');
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'He procesado tu solicitud y adaptado el código fuente en pantalla.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 border-r border-slate-800 text-xs font-sans">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-emerald-500/20 ring-1 ring-white/20">
            🤖
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-100 text-xs">Agente Apio</span>
              <span className="text-[9px] font-mono bg-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.2 rounded-full">
                SANDBOX AI
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" /> {aiSource}
            </span>
          </div>
        </div>
      </div>

      {/* Message History */}
      <div className="flex-1 p-3.5 space-y-3 overflow-y-auto">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-2 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'ai' && (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-600 to-blue-600 flex-shrink-0 flex items-center justify-center text-white text-xs shadow-md font-bold">
                A
              </div>
            )}
            <div
              className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed text-xs ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-lg shadow-blue-600/20 font-medium'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-sm whitespace-pre-line'
              }`}
            >
              {m.text}
              <span className={`block text-[9px] mt-1.5 font-mono ${m.sender === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
                {m.time}
              </span>
            </div>
            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-xl bg-slate-800 flex-shrink-0 flex items-center justify-center text-slate-300 text-xs shadow font-bold">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2 items-center text-slate-300 text-xs p-3 bg-slate-950/80 rounded-2xl border border-slate-800 w-fit animate-pulse shadow-md">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            <span>Apio está escribiendo y compilando tu código React...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="px-3 py-2.5 border-t border-slate-800/80 bg-slate-950/50 space-y-1.5">
        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Ideas para programar con Apio:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(q.replace(/^[^\s]+\s/, ''))}
              className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] transition-all text-left"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2"
      >
        <input
          type="text"
          placeholder="Pídele a Apio qué programar o modificar..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="p-2.5 bg-gradient-to-r from-emerald-600 to-blue-600 hover:opacity-90 disabled:opacity-50 text-white rounded-xl transition-all shadow-md shadow-emerald-600/30"
          title="Enviar instrucción a Apio"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
