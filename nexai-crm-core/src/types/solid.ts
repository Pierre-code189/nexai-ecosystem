import { Tenant } from './tenant';
import { Contact, PipelineDeal, ActivityLog, DashboardMetrics } from './crm';
import { WhatsAppMessage, ChatSession } from './whatsapp';

export interface IStorageAdapter {
  getTenant(id: string): Promise<Tenant | null>;
  saveTenant(tenant: Tenant): Promise<Tenant>;
  getContacts(tenantId: string): Promise<Contact[]>;
  saveContact(contact: Contact): Promise<Contact>;
  deleteContact(id: string, tenantId: string): Promise<boolean>;
  getDeals(tenantId: string): Promise<PipelineDeal[]>;
  saveDeal(deal: PipelineDeal): Promise<PipelineDeal>;
  deleteDeal(id: string, tenantId: string): Promise<boolean>;
  getActivities(tenantId: string): Promise<ActivityLog[]>;
  logActivity(activity: ActivityLog): Promise<void>;
  getChatSessions(tenantId: string): Promise<ChatSession[]>;
  getChatMessages(chatId: string, tenantId: string): Promise<WhatsAppMessage[]>;
  saveChatMessage(message: WhatsAppMessage): Promise<WhatsAppMessage>;
}

export interface IAIEngine {
  generateReply(
    incomingMessage: string,
    history: WhatsAppMessage[],
    systemPrompt: string,
    industryContext: string
  ): Promise<{ replyText: string; extractedLeadInfo?: Record<string, any> }>;
}

export interface IWhatsAppProvider {
  sendMessage(toPhone: string, text: string): Promise<boolean>;
  generateQR(): Promise<string>;
  getConnectionStatus(): Promise<'connected' | 'disconnected' | 'qr_ready'>;
}
