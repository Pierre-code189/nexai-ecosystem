import { IndustryPreset, IndustryType } from '@/types/industry';

export const INDUSTRY_PRESETS: Record<IndustryType, IndustryPreset> = {
  real_estate: {
    id: 'real_estate',
    name: 'Inmobiliaria & Bienes Raíces',
    description: 'Gestión de propiedades, prospectos compradores/arrendatarios, visitas agendadas y reservas.',
    iconName: 'Building2',
    primaryColor: '#0284c7', // Sky Blue
    secondaryColor: '#0369a1',
    terminology: {
      contactsTitle: 'Compradores & Propietarios',
      contactSingle: 'Cliente / Propietario',
      dealsTitle: 'Operaciones Inmobiliarias',
      dealSingle: 'Propiedad / Negocio',
      pipelineTitle: 'Pipeline de Ventas Inmobiliarias',
    },
    defaultStages: [
      { id: 'stage_lead', title: 'Nuevo Prospecto', color: '#64748b', order: 0, probability: 10 },
      { id: 'stage_contacted', title: 'Contacto & Requisitos', color: '#0284c7', order: 1, probability: 25 },
      { id: 'stage_visit', title: 'Visita Agendada', color: '#8b5cf6', order: 2, probability: 50 },
      { id: 'stage_offer', title: 'Propuesta / Separación', color: '#f59e0b', order: 3, probability: 75 },
      { id: 'stage_won', title: 'Venta / Alquiler Cerrado', color: '#10b981', order: 4, probability: 100 },
    ],
    contactFields: [
      {
        id: 'field_re_client_type',
        key: 'clientType',
        label: 'Tipo de Cliente',
        type: 'select',
        entityType: 'contact',
        required: true,
        options: [
          { label: 'Comprador', value: 'comprador' },
          { label: 'Inversionista', value: 'inversionista' },
          { label: 'Arrendatario', value: 'arrendatario' },
          { label: 'Propietario / Vendedor', value: 'propietario' },
        ],
      },
      {
        id: 'field_re_budget',
        key: 'budgetRange',
        label: 'Rango de Presupuesto',
        type: 'text',
        entityType: 'contact',
        required: false,
        placeholder: 'Ej. $80,000 - $120,000',
      },
      {
        id: 'field_re_preferred_zone',
        key: 'preferredZone',
        label: 'Zona / Distrito de Interés',
        type: 'text',
        entityType: 'contact',
        required: false,
        placeholder: 'Ej. Miraflores, San Isidro, Piura Centro',
      },
    ],
    dealFields: [
      {
        id: 'field_re_prop_type',
        key: 'propertyType',
        label: 'Tipo de Propiedad',
        type: 'select',
        entityType: 'deal',
        required: true,
        options: [
          { label: 'Departamento', value: 'departamento' },
          { label: 'Casa', value: 'casa' },
          { label: 'Terreno / Lote', value: 'terreno' },
          { label: 'Oficina / Local Comercial', value: 'comercial' },
        ],
      },
      {
        id: 'field_re_property_code',
        key: 'propertyCode',
        label: 'Código de Propiedad / SKU',
        type: 'text',
        entityType: 'deal',
        required: false,
        placeholder: 'Ej. DEP-402-MIRA',
      },
      {
        id: 'field_re_rooms',
        key: 'bedrooms',
        label: 'Número de Habitaciones',
        type: 'number',
        entityType: 'deal',
        required: false,
        defaultValue: 2,
      },
    ],
    botSystemPromptTemplate: `Eres el Asistente Virtual Inmobiliario de NexCRM. Tu objetivo es calificar prospectos interesados en compra o alquiler de propiedades.
1. Saluda cordial y profesionalmente.
2. Identifica si buscan comprar, alquilar o vender.
3. Pregunta el presupuesto aproximado, zona de interés y tipo de propiedad (casa, departamento, terreno).
4. Ofrece agendar una visita presencial o videollamada con un asesor comercial.
5. Mantén respuestas concisas, empáticas y orientadas al cierre de la cita.`,
  },

  medical: {
    id: 'medical',
    name: 'Salud, Clínicas & Consultorios',
    description: 'Gestión de pacientes, agendamiento de citas médicas, triaje y seguimiento de tratamientos.',
    iconName: 'Stethoscope',
    primaryColor: '#0d9488', // Teal
    secondaryColor: '#0f766e',
    terminology: {
      contactsTitle: 'Pacientes & Consultas',
      contactSingle: 'Paciente',
      dealsTitle: 'Citas & Procedimientos',
      dealSingle: 'Cita / Tratamiento',
      pipelineTitle: 'Flujo de Atención de Pacientes',
    },
    defaultStages: [
      { id: 'stage_med_lead', title: 'Nueva Consulta', color: '#64748b', order: 0, probability: 10 },
      { id: 'stage_med_triaje', title: 'Evaluación / Triaje', color: '#0d9488', order: 1, probability: 30 },
      { id: 'stage_med_booked', title: 'Cita Agendada', color: '#3b82f6', order: 2, probability: 60 },
      { id: 'stage_med_treatment', title: 'En Tratamiento', color: '#f59e0b', order: 3, probability: 85 },
      { id: 'stage_med_completed', title: 'Atención Completada / Alta', color: '#10b981', order: 4, probability: 100 },
    ],
    contactFields: [
      {
        id: 'field_med_dni',
        key: 'nationalId',
        label: 'DNI / Identificación',
        type: 'text',
        entityType: 'contact',
        required: true,
        placeholder: 'Ej. 74859160',
      },
      {
        id: 'field_med_age',
        key: 'age',
        label: 'Edad del Paciente',
        type: 'number',
        entityType: 'contact',
        required: false,
      },
      {
        id: 'field_med_blood_type',
        key: 'insurance',
        label: 'Seguro Médico / EPS',
        type: 'select',
        entityType: 'contact',
        required: false,
        options: [
          { label: 'Particular / Sin Seguro', value: 'particular' },
          { label: 'Rímac Seguros', value: 'rimac' },
          { label: 'Pacífico Salud', value: 'pacifico' },
          { label: 'EsSalud / SIS', value: 'publico' },
        ],
      },
    ],
    dealFields: [
      {
        id: 'field_med_specialty',
        key: 'specialty',
        label: 'Especialidad Requerida',
        type: 'select',
        entityType: 'deal',
        required: true,
        options: [
          { label: 'Medicina General', value: 'general' },
          { label: 'Odontología / Dental', value: 'odontologia' },
          { label: 'Dermatología', value: 'dermatologia' },
          { label: 'Pediatría', value: 'pediatria' },
          { label: 'Fisioterapia & Rehabilitación', value: 'fisioterapia' },
        ],
      },
      {
        id: 'field_med_date',
        key: 'appointmentDate',
        label: 'Fecha y Hora de Cita',
        type: 'date',
        entityType: 'deal',
        required: false,
      },
    ],
    botSystemPromptTemplate: `Eres el Asistente Médico Virtual de la Clínica. Tu misión es orientar al paciente y agendar sus citas de manera cálida y eficiente.
1. Saluda con amabilidad y pregunta qué especialidad o molestia presenta.
2. Solicita el nombre completo y número de DNI para la ficha de atención.
3. Propón horarios disponibles para su consulta.
4. Recuerda al paciente acudir 10 minutos antes y traer sus documentos.
5. Mantén un tono respetuoso, calmado y profesional.`,
  },

  retail: {
    id: 'retail',
    name: 'Retail, E-commerce & Tiendas',
    description: 'Gestión de pedidos, catálogo de productos, carritos abandonados y seguimiento de envíos.',
    iconName: 'ShoppingBag',
    primaryColor: '#f97316', // Orange
    secondaryColor: '#c2410c',
    terminology: {
      contactsTitle: 'Compradores & Clientes',
      contactSingle: 'Cliente',
      dealsTitle: 'Pedidos & Ventas',
      dealSingle: 'Pedido / Orden',
      pipelineTitle: 'Embudo de Ventas Retail',
    },
    defaultStages: [
      { id: 'stage_ret_lead', title: 'Consulta / Carrito', color: '#64748b', order: 0, probability: 15 },
      { id: 'stage_ret_quote', title: 'Cotización Enviada', color: '#f97316', order: 1, probability: 40 },
      { id: 'stage_ret_payment', title: 'Pago Pendiente', color: '#eab308', order: 2, probability: 70 },
      { id: 'stage_ret_shipping', title: 'En Preparación / Envío', color: '#3b82f6', order: 3, probability: 90 },
      { id: 'stage_ret_delivered', title: 'Entregado & Conforme', color: '#10b981', order: 4, probability: 100 },
    ],
    contactFields: [
      {
        id: 'field_ret_address',
        key: 'deliveryAddress',
        label: 'Dirección de Entrega',
        type: 'text',
        entityType: 'contact',
        required: false,
        placeholder: 'Av. Principal 123, Urb. Los Rosales',
      },
      {
        id: 'field_ret_city',
        key: 'city',
        label: 'Ciudad / Región',
        type: 'text',
        entityType: 'contact',
        required: false,
        defaultValue: 'Piura',
      },
    ],
    dealFields: [
      {
        id: 'field_ret_products',
        key: 'productList',
        label: 'Productos Solicitados',
        type: 'text',
        entityType: 'deal',
        required: true,
        placeholder: 'Ej. 2x Zapatillas Runner Pro, 1x Medias Sport',
      },
      {
        id: 'field_ret_payment_method',
        key: 'paymentMethod',
        label: 'Método de Pago',
        type: 'select',
        entityType: 'deal',
        required: false,
        options: [
          { label: 'Yape / Plin', value: 'yape_plin' },
          { label: 'Transferencia BCP / Interbank', value: 'transferencia' },
          { label: 'Tarjeta Débito / Crédito (Stripe / Link)', value: 'tarjeta' },
          { label: 'Pago Contraentrega', value: 'contraentrega' },
        ],
      },
    ],
    botSystemPromptTemplate: `Eres el Asistente de Ventas y Soporte de la tienda online.
1. Saluda con entusiasmo y responde dudas sobre productos, tallas, colores, precios y stock.
2. Comparte métodos de pago (Yape, Plin, Transferencia o Tarjeta).
3. Solicita dirección de envío y nombre del destinatario al confirmar el pedido.
4. Genera una orden de compra clara con el resumen de productos y total a pagar.`,
  },

  services: {
    id: 'services',
    name: 'Consultoría & Servicios Profesionales (B2B)',
    description: 'Cotizaciones corporativas, propuestas comerciales, contratos y gestión de proyectos.',
    iconName: 'Briefcase',
    primaryColor: '#6366f1', // Indigo
    secondaryColor: '#4338ca',
    terminology: {
      contactsTitle: 'Empresas & Clientes B2B',
      contactSingle: 'Contacto / Empresa',
      dealsTitle: 'Proyectos & Propuestas',
      dealSingle: 'Propuesta / Proyecto',
      pipelineTitle: 'Embudo de Contrataciones B2B',
    },
    defaultStages: [
      { id: 'stage_srv_lead', title: 'Lead Calificado', color: '#64748b', order: 0, probability: 10 },
      { id: 'stage_srv_discovery', title: 'Reunión de Diagnóstico', color: '#6366f1', order: 1, probability: 30 },
      { id: 'stage_srv_proposal', title: 'Propuesta Comercial', color: '#f59e0b', order: 2, probability: 60 },
      { id: 'stage_srv_negotiation', title: 'Negociación / Revisión', color: '#ec4899', order: 3, probability: 80 },
      { id: 'stage_srv_won', title: 'Contrato Cerrado', color: '#10b981', order: 4, probability: 100 },
    ],
    contactFields: [
      {
        id: 'field_srv_ruc',
        key: 'taxId',
        label: 'RUC / Tax ID',
        type: 'text',
        entityType: 'contact',
        required: false,
        placeholder: '20601234567',
      },
      {
        id: 'field_srv_role',
        key: 'jobPosition',
        label: 'Cargo del Contacto',
        type: 'text',
        entityType: 'contact',
        required: false,
        placeholder: 'Gerente General / CTO / Jefe de Compras',
      },
    ],
    dealFields: [
      {
        id: 'field_srv_service_type',
        key: 'serviceType',
        label: 'Tipo de Servicio',
        type: 'select',
        entityType: 'deal',
        required: true,
        options: [
          { label: 'Desarrollo de Software / Apps', value: 'software' },
          { label: 'Consultoría Tecnológica & Cloud', value: 'consultoria' },
          { label: 'Marketing Digital & Pauta', value: 'marketing' },
          { label: 'Capacitación & Auditoría', value: 'auditoria' },
        ],
      },
      {
        id: 'field_srv_duration',
        key: 'projectDuration',
        label: 'Duración Estimada (Meses)',
        type: 'number',
        entityType: 'deal',
        required: false,
        defaultValue: 3,
      },
    ],
    botSystemPromptTemplate: `Eres el Asistente Ejecutivo B2B para Consultoría y Servicios.
1. Atiende de manera formal, ejecutiva y estructurada.
2. Identifica la empresa, necesidades técnicas o de negocio del cliente y plazo estimado.
3. Ofrece agendar una sesión de descubrimiento de 30 minutos con un consultor senior.
4. Recopila información clave para que el equipo comercial elabore una propuesta personalizada.`,
  },

  custom: {
    id: 'custom',
    name: 'Cascarón Vacío Personalizado (Custom)',
    description: 'Crea tu propia estructura desde cero definiendo campos, etapas y marca a tu medida.',
    iconName: 'Settings2',
    primaryColor: '#3b82f6',
    secondaryColor: '#1d4ed8',
    terminology: {
      contactsTitle: 'Contactos & Leads',
      contactSingle: 'Contacto',
      dealsTitle: 'Oportunidades & Tratos',
      dealSingle: 'Oportunidad',
      pipelineTitle: 'Pipeline de Ventas',
    },
    defaultStages: [
      { id: 'stage_cus_1', title: 'Nuevo Lead', color: '#64748b', order: 0, probability: 10 },
      { id: 'stage_cus_2', title: 'En Calificación', color: '#3b82f6', order: 1, probability: 35 },
      { id: 'stage_cus_3', title: 'Propuesta', color: '#f59e0b', order: 2, probability: 70 },
      { id: 'stage_cus_4', title: 'Ganado / Cerrado', color: '#10b981', order: 3, probability: 100 },
    ],
    contactFields: [
      {
        id: 'field_cus_notes',
        key: 'customNote',
        label: 'Información Adicional',
        type: 'text',
        entityType: 'contact',
        required: false,
        placeholder: 'Detalles personalizados del cliente...',
      },
    ],
    dealFields: [
      {
        id: 'field_cus_category',
        key: 'dealCategory',
        label: 'Categoría',
        type: 'text',
        entityType: 'deal',
        required: false,
        placeholder: 'Categoría personalizada',
      },
    ],
    botSystemPromptTemplate: `Eres el Asistente Inteligente de Atención al Cliente de NexCRM.
1. Saluda con cordialidad.
2. Identifica los requerimientos del cliente.
3. Responde a sus dudas y solicita información de contacto para dar seguimiento.
4. Registra los requerimientos con precisión.`,
  },
};
