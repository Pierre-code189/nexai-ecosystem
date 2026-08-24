import { Tenant } from '@/types/tenant';
import { Contact, PipelineDeal, ActivityLog } from '@/types/crm';
import { ChatSession, WhatsAppMessage } from '@/types/whatsapp';
import { INDUSTRY_PRESETS } from './solid/IndustryPresets';

export const INITIAL_TENANTS: Tenant[] = [];
export const INITIAL_CONTACTS: Contact[] = [];
export const INITIAL_DEALS: PipelineDeal[] = [];
export const INITIAL_ACTIVITIES: ActivityLog[] = [];
export const INITIAL_CHATS: ChatSession[] = [];
export const INITIAL_MESSAGES: Record<string, WhatsAppMessage[]> = {};
