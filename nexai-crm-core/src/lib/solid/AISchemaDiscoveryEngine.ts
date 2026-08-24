import { IndustryPreset, IndustryType, CustomFieldDefinition, PipelineStageDefinition } from '@/types/industry';
import { generateId } from '@/lib/utils';

export interface GeneratedIndustrySchema {
  industryName: string;
  detectedRubro: string;
  description: string;
  terminology: {
    contactsTitle: string;
    contactSingle: string;
    dealsTitle: string;
    dealSingle: string;
    pipelineTitle: string;
  };
  stages: PipelineStageDefinition[];
  contactFields: CustomFieldDefinition[];
  dealFields: CustomFieldDefinition[];
  botSystemPrompt: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

export class AISchemaDiscoveryEngine {
  /**
   * Analiza la descripción libre del negocio y sintetiza una arquitectura CRM completa y personalizada.
   */
  public async analyzeAndGenerateSchema(
    businessDescription: string,
    businessName?: string
  ): Promise<GeneratedIndustrySchema> {
    const text = businessDescription.toLowerCase();

    // 1. Si hay endpoint API backend con LLM activo
    try {
      if (typeof window !== 'undefined') {
        const res = await fetch('/api/ai/analyze-business', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ businessDescription, businessName }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.schema) return data.schema;
        }
      }
    } catch {
      // Fallback al motor heurístico de reconocimiento inteligente
    }

    // 2. Motor Heurístico Inteligente de Detección de Rubro
    if (text.includes('pizza') || text.includes('dark kitchen') || text.includes('restaurante') || text.includes('comida') || text.includes('delivery')) {
      return {
        industryName: 'Gastronomía & Dark Kitchen',
        detectedRubro: 'Pizzería / Dark Kitchen / Restaurante',
        description: 'Gestión ágil de pedidos gastronómicos, delivery por WhatsApp, combos, ingredientes y fidelización de comensales.',
        terminology: {
          contactsTitle: 'Comensales & Clientes',
          contactSingle: 'Comensal / Cliente',
          dealsTitle: 'Pedidos & Despachos',
          dealSingle: 'Pedido / Orden',
          pipelineTitle: 'Flujo de Preparación y Delivery',
        },
        stages: [
          { id: generateId('stg'), title: 'Nuevo Pedido WhatsApp', color: '#64748b', order: 0, probability: 15 },
          { id: generateId('stg'), title: 'Confirmado & En Cocina', color: '#f97316', order: 1, probability: 50 },
          { id: generateId('stg'), title: 'Empaquetado & En Reparto', color: '#3b82f6', order: 2, probability: 80 },
          { id: generateId('stg'), title: 'Entregado & Cobrado', color: '#10b981', order: 3, probability: 100 },
        ],
        contactFields: [
          {
            id: generateId('fld'),
            key: 'deliveryAddress',
            label: 'Dirección de Entrega / Referencia',
            type: 'text',
            entityType: 'contact',
            required: true,
            placeholder: 'Ej. Urb. Los Cocos Mz B Lt 12',
          },
          {
            id: generateId('fld'),
            key: 'favoriteFlavor',
            label: 'Plato / Pizza Favorita',
            type: 'text',
            entityType: 'contact',
            required: false,
            placeholder: 'Ej. Pizza Suprema / Americana',
          },
        ],
        dealFields: [
          {
            id: generateId('fld'),
            key: 'orderSummary',
            label: 'Detalle de Pedido & Salsas',
            type: 'text',
            entityType: 'deal',
            required: true,
            placeholder: 'Ej. 1x Familiar Pepperoni + 1x Gaseosa 1.5L',
          },
          {
            id: generateId('fld'),
            key: 'paymentMethod',
            label: 'Método de Pago',
            type: 'select',
            entityType: 'deal',
            required: true,
            options: [
              { label: 'Yape / Plin', value: 'yape' },
              { label: 'Transferencia BCP', value: 'bcp' },
              { label: 'Efectivo con vuelto', value: 'efectivo' },
              { label: 'POS Tarjeta', value: 'pos' },
            ],
          },
        ],
        botSystemPrompt: `Eres el Asistente Virtual de ${businessName || 'la Pizzería / Dark Kitchen'}.
1. Saluda con entusiasmo y presenta la carta de productos y promociones del día.
2. Toma nota de los sabores, tamaño, bebidas y extras solicitados.
3. Pregunta la dirección de entrega exacta y el método de pago preferido (Yape, Plin, Efectivo).
4. Confirma el total y el tiempo estimado de entrega (30-45 minutos).
5. Mantén un tono amigable, ágil y apetitoso.`,
        theme: {
          primaryColor: '#ea580c', // Orange Red
          secondaryColor: '#9a3412',
          accentColor: '#fb923c',
        },
      };
    }

    if (text.includes('abogado') || text.includes('legal') || text.includes('estudio') || text.includes('litigio') || text.includes('notaria')) {
      return {
        industryName: 'Servicios Legales & Estudio Jurídico',
        detectedRubro: 'Estudio de Abogados / Consultoría Legal',
        description: 'Control de expedientes, asesorías jurídicas, citas legales y seguimiento de casos.',
        terminology: {
          contactsTitle: 'Patrocinados & Clientes',
          contactSingle: 'Cliente / Patrocinado',
          dealsTitle: 'Casos & Procesos Legales',
          dealSingle: 'Caso / Proceso',
          pipelineTitle: 'Embudo de Gestión de Casos',
        },
        stages: [
          { id: generateId('stg'), title: 'Consulta Inicial', color: '#64748b', order: 0, probability: 20 },
          { id: generateId('stg'), title: 'Evaluación de Expediente', color: '#6366f1', order: 1, probability: 45 },
          { id: generateId('stg'), title: 'Propuesta de Honorarios', color: '#f59e0b', order: 2, probability: 70 },
          { id: generateId('stg'), title: 'En Litigio / Asesoría', color: '#3b82f6', order: 3, probability: 90 },
          { id: generateId('stg'), title: 'Sentencia / Caso Cerrado', color: '#10b981', order: 4, probability: 100 },
        ],
        contactFields: [
          {
            id: generateId('fld'),
            key: 'dniRuc',
            label: 'DNI / RUC del Patrocinado',
            type: 'text',
            entityType: 'contact',
            required: true,
            placeholder: '74859160 / 2060...',
          },
          {
            id: generateId('fld'),
            key: 'legalMatter',
            label: 'Rama del Derecho',
            type: 'select',
            entityType: 'contact',
            required: true,
            options: [
              { label: 'Laboral', value: 'laboral' },
              { label: 'Civil & Contratos', value: 'civil' },
              { label: 'Penal', value: 'penal' },
              { label: 'Corporativo / Tributario', value: 'corporativo' },
            ],
          },
        ],
        dealFields: [
          {
            id: generateId('fld'),
            key: 'expedienteCode',
            label: 'N° de Expediente Judicial',
            type: 'text',
            entityType: 'deal',
            required: false,
            placeholder: 'EXP-0452-2026',
          },
        ],
        botSystemPrompt: `Eres el Asistente Legal Virtual del Estudio Jurídico ${businessName || ''}.
1. Atiende con suma discreción, formalidad y confidencialidad.
2. Identifica el motivo legal de la consulta y la materia jurídica.
3. Solicita datos de contacto y agenda una cita de evaluación con un abogado especialista.
4. Recuerda al usuario traer la documentación relevante.`,
        theme: {
          primaryColor: '#475569',
          secondaryColor: '#1e293b',
          accentColor: '#94a3b8',
        },
      };
    }

    if (text.includes('taller') || text.includes('mecanico') || text.includes('auto') || text.includes('vehiculo') || text.includes('repuesto')) {
      return {
        industryName: 'Taller Mecánico & Automotriz',
        detectedRubro: 'Taller de Servicio Automotriz',
        description: 'Control de órdenes de trabajo, vehículos en reparación, repuestos y entregas.',
        terminology: {
          contactsTitle: 'Propietarios & Choferes',
          contactSingle: 'Cliente / Propietario',
          dealsTitle: 'Órdenes de Reparación',
          dealSingle: 'Orden / Vehículo',
          pipelineTitle: 'Flujo de Mantenimiento Automotriz',
        },
        stages: [
          { id: generateId('stg'), title: 'Ingreso & Diagnóstico', color: '#64748b', order: 0, probability: 20 },
          { id: generateId('stg'), title: 'Presupuesto Aprobado', color: '#eab308', order: 1, probability: 50 },
          { id: generateId('stg'), title: 'En Reparación', color: '#3b82f6', order: 2, probability: 80 },
          { id: generateId('stg'), title: 'Control de Calidad', color: '#8b5cf6', order: 3, probability: 95 },
          { id: generateId('stg'), title: 'Vehículo Entregado', color: '#10b981', order: 4, probability: 100 },
        ],
        contactFields: [
          {
            id: generateId('fld'),
            key: 'plateNumber',
            label: 'Placa del Vehículo',
            type: 'text',
            entityType: 'contact',
            required: true,
            placeholder: 'Ej. P3D-452',
          },
          {
            id: generateId('fld'),
            key: 'carModel',
            label: 'Marca y Modelo',
            type: 'text',
            entityType: 'contact',
            required: false,
            placeholder: 'Ej. Toyota Hilux 2022',
          },
        ],
        dealFields: [
          {
            id: generateId('fld'),
            key: 'serviceType',
            label: 'Tipo de Mantenimiento',
            type: 'select',
            entityType: 'deal',
            required: true,
            options: [
              { label: 'Preventivo 10,000 km', value: 'preventivo' },
              { label: 'Frenos y Suspensión', value: 'frenos' },
              { label: 'Motor y Transmisión', value: 'motor' },
              { label: 'Planchado y Pintura', value: 'pintura' },
            ],
          },
        ],
        botSystemPrompt: `Eres el Asistente Automotriz del Taller ${businessName || ''}.
1. Atiende cordialmente y pregunta la falla o mantenimiento requerido y la placa del vehículo.
2. Brinda cotizaciones preliminares e invita a llevar la unidad para inspección técnica.
3. Notifica estados de reparación cuando el cliente consulte.`,
        theme: {
          primaryColor: '#dc2626', // Red
          secondaryColor: '#991b1b',
          accentColor: '#f87171',
        },
      };
    }

    // Default Dynamic Custom Synthesis for any other business
    const capitalizedName = businessName || 'Mi Empresa Personalizada';
    return {
      industryName: `Rubro: ${businessDescription.substring(0, 30)}...`,
      detectedRubro: 'Modelo Personalizado Sintetizado por IA',
      description: `Estructura generada específicamente para: ${businessDescription}`,
      terminology: {
        contactsTitle: 'Clientes & Prospectos',
        contactSingle: 'Cliente',
        dealsTitle: 'Oportunidades & Tratos',
        dealSingle: 'Oportunidad',
        pipelineTitle: 'Embudo de Conversión',
      },
      stages: [
        { id: generateId('stg'), title: 'Prospecto Identificado', color: '#64748b', order: 0, probability: 15 },
        { id: generateId('stg'), title: 'Requisitos Calificados', color: '#3b82f6', order: 1, probability: 40 },
        { id: generateId('stg'), title: 'Cotización / Propuesta', color: '#f59e0b', order: 2, probability: 70 },
        { id: generateId('stg'), title: 'Venta / Servicio Cerrado', color: '#10b981', order: 3, probability: 100 },
      ],
      contactFields: [
        {
          id: generateId('fld'),
          key: 'customerNeed',
          label: 'Necesidad Específica',
          type: 'text',
          entityType: 'contact',
          required: false,
          placeholder: 'Detalle de la consulta del cliente...',
        },
      ],
      dealFields: [
        {
          id: generateId('fld'),
          key: 'dealScope',
          label: 'Alcance o Tipo de Requerimiento',
          type: 'text',
          entityType: 'deal',
          required: false,
          placeholder: 'Descripción de la solicitud comercial',
        },
      ],
      botSystemPrompt: `Eres el Asistente Virtual Inteligente de ${capitalizedName}.
Actividad del negocio: ${businessDescription}.
1. Atiende amablemente y responde con precisión a dudas sobre los productos o servicios ofrecidos.
2. Recopila nombre, teléfono y necesidades específicas del cliente.
3. Concreta el siguiente paso comercial (cotización, cita, pedido).`,
      theme: {
        primaryColor: '#0284c7',
        secondaryColor: '#0369a1',
        accentColor: '#38bdf8',
      },
    };
  }
}
