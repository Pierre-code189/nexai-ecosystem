export interface Contact {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: 'active' | 'lead' | 'customer' | 'archived';
  tags: string[];
  customData: Record<string, any>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineDeal {
  id: string;
  tenantId: string;
  title: string;
  value: number;
  stageId: string;
  contactId: string;
  contactName: string;
  contactPhone?: string;
  priority: 'low' | 'medium' | 'high';
  expectedCloseDate?: string;
  customData: Record<string, any>;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  tenantId: string;
  type: 'deal_created' | 'deal_moved' | 'contact_created' | 'whatsapp_message' | 'bot_reply';
  title: string;
  description: string;
  timestamp: string;
  entityId?: string;
  entityType?: 'contact' | 'deal' | 'whatsapp';
}

export interface DashboardMetrics {
  totalRevenue: number;
  activeDealsCount: number;
  wonDealsCount: number;
  totalContactsCount: number;
  conversionRate: number;
  activeWhatsAppChats: number;
  mrr: number;
  avgDealSize: number;
}
