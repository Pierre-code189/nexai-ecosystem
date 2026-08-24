export interface MultiAgent {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'admin' | 'supervisor' | 'agent';
  status: 'online' | 'busy' | 'offline';
  assignedChatsCount: number;
}

export interface DripSequenceRule {
  id: string;
  tenantId: string;
  title: string;
  triggerStageId: string;
  daysInactive: number;
  messageTemplate: string;
  enabled: boolean;
  sentCount: number;
}

export interface PaymentQRConfig {
  merchantName: string;
  yapePhone: string;
  plinPhone: string;
  bcpAccount?: string;
  qrImageUrl?: string;
  stripeEnabled: boolean;
}
