import { IndustryType, PipelineStageDefinition, CustomFieldDefinition } from './industry';

export type PlanType = 'trial' | 'basic' | 'pro' | 'enterprise';

export interface TenantTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl?: string;
  faviconUrl?: string;
  fontFamily?: string;
  darkModeDefault: boolean;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  industry: IndustryType;
  plan: PlanType;
  trialExpiresAt?: string;
  theme: TenantTheme;
  currency: string;
  stages: PipelineStageDefinition[];
  customFields: CustomFieldDefinition[];
  whatsappBotPrompt?: string;
  whatsappAutoReply: boolean;
  createdAt: string;
  updatedAt: string;
}
