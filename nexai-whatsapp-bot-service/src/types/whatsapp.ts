export type MessageSender = 'user' | 'bot' | 'agent';

export interface WhatsAppMessage {
  id: string;
  tenantId: string;
  chatId: string;
  sender: MessageSender;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  extractedLeadData?: Record<string, any>;
}

export interface ChatSession {
  id: string;
  tenantId: string;
  phoneNumber: string;
  contactName: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: string;
  contactId?: string;
  stage?: string;
  isAiEnabled: boolean;
}

export interface WhatsAppSessionState {
  status: 'disconnected' | 'connecting' | 'connected' | 'qr_ready';
  qrCodeUrl?: string;
  phoneNumber?: string;
  connectedAt?: string;
}
