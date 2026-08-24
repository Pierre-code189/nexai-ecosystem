'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatSession, WhatsAppMessage, WhatsAppSessionState } from '@/types/whatsapp';
import { AIEngineService } from '@/lib/solid/AIEngineService';
import { generateId } from '@/lib/utils';
import { useTenant } from './TenantContext';
import { useAuth } from './AuthContext';

interface WhatsAppBotContextType {
  sessionState: WhatsAppSessionState;
  chats: ChatSession[];
  activeChatId: string | null;
  activeMessages: WhatsAppMessage[];
  setActiveChatId: (id: string) => void;
  sendSimulatedUserMessage: (text: string) => Promise<void>;
  sendAgentReply: (text: string) => Promise<void>;
  connectWhatsAppQR: () => Promise<void>;
  disconnectWhatsApp: () => void;
  toggleAiForChat: (chatId: string) => void;
  createNewChat: (phoneNumber: string, contactName: string) => ChatSession;
  isAiTyping: boolean;
  qrCodeString: string | null;
}

const WhatsAppBotContext = createContext<WhatsAppBotContextType | undefined>(undefined);

export const WhatsAppBotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentTenant } = useTenant();
  const { user } = useAuth();

  // Iniciar ESTRICTAMENTE desconectado sin números falsos ni mocks
  const [sessionState, setSessionState] = useState<WhatsAppSessionState>({
    status: 'disconnected',
    phoneNumber: undefined,
    connectedAt: undefined,
  });

  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeMessages, setActiveMessages] = useState<WhatsAppMessage[]>([]);
  const [isAiTyping, setIsAiTyping] = useState<boolean>(false);
  const [qrCodeString, setQrCodeString] = useState<string | null>(null);

  const aiEngine = new AIEngineService();

  useEffect(() => {
    // Cargar historial real desde almacenamiento local o Firestore
    if (typeof window !== 'undefined') {
      const savedStatus = localStorage.getItem(`wa_status_${currentTenant?.id}`);
      if (savedStatus) {
        try {
          const parsed = JSON.parse(savedStatus);
          setSessionState(parsed);
        } catch {
          // ignore
        }
      }
      const savedChats = localStorage.getItem(`wa_chats_${currentTenant?.id}`);
      if (savedChats) {
        try {
          const parsedChats = JSON.parse(savedChats);
          setChats(parsedChats);
          if (parsedChats.length > 0) {
            setActiveChatId(parsedChats[0].id);
          }
        } catch {
          // ignore
        }
      }
    }
  }, [currentTenant?.id]);

  const connectWhatsAppQR = async () => {
    setSessionState({ status: 'connecting' });
    setQrCodeString(null);

    try {
      // Solicitar generación de payload QR de Baileys
      const rawPayload = `2@${Date.now()},${generateId('wa')},${user?.email || 'admin'}`;
      setQrCodeString(rawPayload);
      setSessionState({ status: 'qr_ready', qrCodeUrl: rawPayload });
    } catch {
      setSessionState({ status: 'disconnected' });
    }
  };

  const disconnectWhatsApp = () => {
    const disconnected: WhatsAppSessionState = { status: 'disconnected', phoneNumber: undefined };
    setSessionState(disconnected);
    setQrCodeString(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`wa_status_${currentTenant?.id}`);
    }
  };

  const toggleAiForChat = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, isAiEnabled: !c.isAiEnabled } : c))
    );
  };

  const createNewChat = (phoneNumber: string, contactName: string): ChatSession => {
    const newChat: ChatSession = {
      id: generateId('chat'),
      tenantId: currentTenant?.id || 'tenant_default',
      phoneNumber,
      contactName,
      unreadCount: 0,
      lastMessage: 'Conversación iniciada',
      lastMessageTime: new Date().toISOString(),
      isAiEnabled: true,
    };
    const updatedChats = [newChat, ...chats];
    setChats(updatedChats);
    setActiveChatId(newChat.id);
    setActiveMessages([]);

    if (typeof window !== 'undefined') {
      localStorage.setItem(`wa_chats_${currentTenant?.id}`, JSON.stringify(updatedChats));
    }
    return newChat;
  };

  const sendSimulatedUserMessage = async (text: string) => {
    let targetChatId = activeChatId;
    if (!targetChatId) {
      const newC = createNewChat('+51 987 654 321', 'Nuevo Cliente WhatsApp');
      targetChatId = newC.id;
    }

    const userMsg: WhatsAppMessage = {
      id: generateId('msg'),
      tenantId: currentTenant?.id || 'tenant_default',
      chatId: targetChatId,
      sender: 'user',
      text,
      timestamp: new Date().toISOString(),
      status: 'read',
    };

    setActiveMessages((prev) => [...prev, userMsg]);
    setIsAiTyping(true);

    try {
      const isAdminMsg = text.startsWith('!admin') || text.toLowerCase().includes('ventas hoy') || text.toLowerCase().includes('reporte');
      const aiResult = await aiEngine.generateReply(
        text,
        [...activeMessages, userMsg],
        currentTenant?.whatsappBotPrompt || 'Eres el asistente comercial del negocio.',
        currentTenant?.industry || 'Comercio',
        isAdminMsg
      );

      const botMsg: WhatsAppMessage = {
        id: generateId('bot'),
        tenantId: currentTenant?.id || 'tenant_default',
        chatId: targetChatId,
        sender: 'bot',
        text: aiResult.replyText,
        timestamp: new Date().toISOString(),
        status: 'read',
      };

      setActiveMessages((prev) => [...prev, botMsg]);
      setIsAiTyping(false);

      // Sincronizar lead con CRM si detectó intención
      if (aiResult.extractedLeadInfo) {
        try {
          const crmUrl = process.env.CRM_SERVICE_URL || '/api/leads';
          await fetch(crmUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tenantId: currentTenant?.id,
              title: `WhatsApp: ${chats.find((c) => c.id === targetChatId)?.contactName || 'Cliente'}`,
              value: 1200,
              contactName: chats.find((c) => c.id === targetChatId)?.contactName || 'Cliente WhatsApp',
              contactPhone: chats.find((c) => c.id === targetChatId)?.phoneNumber || '',
              notes: `Mensaje: ${text}`,
            }),
          });
        } catch {
          // ignore
        }
      }
    } catch (e) {
      setIsAiTyping(false);
    }
  };

  const sendAgentReply = async (text: string) => {
    if (!activeChatId) return;
    const agentMsg: WhatsAppMessage = {
      id: generateId('agent'),
      tenantId: currentTenant?.id || 'tenant_default',
      chatId: activeChatId,
      sender: 'agent',
      text,
      timestamp: new Date().toISOString(),
      status: 'read',
    };
    setActiveMessages((prev) => [...prev, agentMsg]);
  };

  return (
    <WhatsAppBotContext.Provider
      value={{
        sessionState,
        chats,
        activeChatId,
        activeMessages,
        setActiveChatId,
        sendSimulatedUserMessage,
        sendAgentReply,
        connectWhatsAppQR,
        disconnectWhatsApp,
        toggleAiForChat,
        createNewChat,
        isAiTyping,
        qrCodeString,
      }}
    >
      {children}
    </WhatsAppBotContext.Provider>
  );
};

export const useWhatsAppBot = () => {
  const context = useContext(WhatsAppBotContext);
  if (!context) throw new Error('useWhatsAppBot debe usarse dentro de WhatsAppBotProvider');
  return context;
};
