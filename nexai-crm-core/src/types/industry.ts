export type IndustryType = 'real_estate' | 'medical' | 'retail' | 'services' | 'custom';

export type FieldType = 'text' | 'number' | 'currency' | 'date' | 'select' | 'boolean' | 'email' | 'phone';

export interface CustomFieldOption {
  label: string;
  value: string;
  color?: string;
}

export interface CustomFieldDefinition {
  id: string;
  key: string;
  label: string;
  type: FieldType;
  entityType: 'contact' | 'deal';
  required: boolean;
  defaultValue?: string | number | boolean;
  options?: CustomFieldOption[];
  placeholder?: string;
  description?: string;
}

export interface PipelineStageDefinition {
  id: string;
  title: string;
  color: string;
  order: number;
  probability?: number;
  description?: string;
}

export interface IndustryPreset {
  id: IndustryType;
  name: string;
  description: string;
  iconName: string;
  primaryColor: string;
  secondaryColor: string;
  defaultStages: PipelineStageDefinition[];
  contactFields: CustomFieldDefinition[];
  dealFields: CustomFieldDefinition[];
  botSystemPromptTemplate: string;
  terminology: {
    contactsTitle: string;
    contactSingle: string;
    dealsTitle: string;
    dealSingle: string;
    pipelineTitle: string;
  };
}
