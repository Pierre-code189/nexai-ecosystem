import { IStorageAdapter } from '@/types/solid';
import { Tenant } from '@/types/tenant';
import { Contact, PipelineDeal, ActivityLog } from '@/types/crm';
import { ChatSession, WhatsAppMessage } from '@/types/whatsapp';

export class LocalStorageAdapter implements IStorageAdapter {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  private getItem<T>(key: string, defaultVal: T): T {
    if (!this.isBrowser()) return defaultVal;
    const raw = localStorage.getItem(key);
    if (!raw) return defaultVal;
    try {
      return JSON.parse(raw);
    } catch {
      return defaultVal;
    }
  }

  private setItem<T>(key: string, val: T): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(key, JSON.stringify(val));
  }

  async getTenant(id: string): Promise<Tenant | null> {
    const tenants = this.getItem<Tenant[]>('crm_tenants', []);
    return tenants.find((t) => t.id === id) || tenants[0] || null;
  }

  async saveTenant(tenant: Tenant): Promise<Tenant> {
    const tenants = this.getItem<Tenant[]>('crm_tenants', []);
    const index = tenants.findIndex((t) => t.id === tenant.id);
    if (index >= 0) {
      tenants[index] = tenant;
    } else {
      tenants.push(tenant);
    }
    this.setItem('crm_tenants', tenants);
    return tenant;
  }

  async getContacts(tenantId: string): Promise<Contact[]> {
    const contacts = this.getItem<Contact[]>('crm_contacts', []);
    return contacts.filter((c) => c.tenantId === tenantId);
  }

  async saveContact(contact: Contact): Promise<Contact> {
    const contacts = this.getItem<Contact[]>('crm_contacts', []);
    const index = contacts.findIndex((c) => c.id === contact.id);
    if (index >= 0) {
      contacts[index] = contact;
    } else {
      contacts.unshift(contact);
    }
    this.setItem('crm_contacts', contacts);
    return contact;
  }

  async deleteContact(id: string, tenantId: string): Promise<boolean> {
    const contacts = this.getItem<Contact[]>('crm_contacts', []);
    const filtered = contacts.filter((c) => !(c.id === id && c.tenantId === tenantId));
    this.setItem('crm_contacts', filtered);
    return true;
  }

  async getDeals(tenantId: string): Promise<PipelineDeal[]> {
    const deals = this.getItem<PipelineDeal[]>('crm_deals', []);
    return deals.filter((d) => d.tenantId === tenantId);
  }

  async saveDeal(deal: PipelineDeal): Promise<PipelineDeal> {
    const deals = this.getItem<PipelineDeal[]>('crm_deals', []);
    const index = deals.findIndex((d) => d.id === deal.id);
    if (index >= 0) {
      deals[index] = deal;
    } else {
      deals.unshift(deal);
    }
    this.setItem('crm_deals', deals);
    return deal;
  }

  async deleteDeal(id: string, tenantId: string): Promise<boolean> {
    const deals = this.getItem<PipelineDeal[]>('crm_deals', []);
    const filtered = deals.filter((d) => !(d.id === id && d.tenantId === tenantId));
    this.setItem('crm_deals', filtered);
    return true;
  }

  async getActivities(tenantId: string): Promise<ActivityLog[]> {
    const acts = this.getItem<ActivityLog[]>('crm_activities', []);
    return acts.filter((a) => a.tenantId === tenantId);
  }

  async logActivity(activity: ActivityLog): Promise<void> {
    const acts = this.getItem<ActivityLog[]>('crm_activities', []);
    acts.unshift(activity);
    this.setItem('crm_activities', acts.slice(0, 100));
  }

  async getChatSessions(tenantId: string): Promise<ChatSession[]> {
    const chats = this.getItem<ChatSession[]>('crm_chats', []);
    return chats.filter((c) => c.tenantId === tenantId);
  }

  async getChatMessages(chatId: string, tenantId: string): Promise<WhatsAppMessage[]> {
    const allMsgs = this.getItem<Record<string, WhatsAppMessage[]>>('crm_messages', {});
    const msgs = allMsgs[chatId] || [];
    return msgs.filter((m) => m.tenantId === tenantId);
  }

  async saveChatMessage(message: WhatsAppMessage): Promise<WhatsAppMessage> {
    const allMsgs = this.getItem<Record<string, WhatsAppMessage[]>>('crm_messages', {});
    if (!allMsgs[message.chatId]) {
      allMsgs[message.chatId] = [];
    }
    allMsgs[message.chatId].push(message);
    this.setItem('crm_messages', allMsgs);

    const chats = this.getItem<ChatSession[]>('crm_chats', []);
    const chat = chats.find((c) => c.id === message.chatId);
    if (chat) {
      chat.lastMessage = message.text;
      chat.lastMessageTime = message.timestamp;
      this.setItem('crm_chats', chats);
    }

    return message;
  }
}
