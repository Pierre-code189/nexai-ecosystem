import { NextResponse } from 'next/server';
import { getDynamicAIConfig } from '@/lib/aiConfig';

export async function POST(req: Request) {
  try {
    const { businessDescription, businessName, colabUrl: clientColabUrl } = await req.json();

    if (!businessDescription || typeof businessDescription !== 'string') {
      return NextResponse.json({ error: 'Descripción requerida' }, { status: 400 });
    }

    const { ollamaUrl, groqKey, modelName } = await getDynamicAIConfig(clientColabUrl);

    const systemPrompt = `Eres un arquitecto de software experto en diseño de CRMs y modelado de datos.
El usuario te describirá un negocio. Tu tarea es responder ÚNICAMENTE con un JSON válido con la siguiente estructura exacta:
{
  "industryName": "Nombre del rubro",
  "detectedRubro": "Tipo de negocio detectado",
  "description": "Breve descripción",
  "terminology": {
    "contactsTitle": "Ej. Pacientes / Alumnos / Comensales",
    "contactSingle": "Ej. Paciente / Alumno",
    "dealsTitle": "Ej. Citas / Matrículas / Pedidos",
    "dealSingle": "Ej. Cita / Matrícula",
    "pipelineTitle": "Ej. Embudo de Atención"
  },
  "stages": [
    { "id": "stg_1", "title": "Primer Contacto", "color": "#3b82f6", "order": 0, "probability": 20 },
    { "id": "stg_2", "title": "En Evaluación / Cotización", "color": "#8b5cf6", "order": 1, "probability": 50 },
    { "id": "stg_3", "title": "Propuesta / Agendado", "color": "#f59e0b", "order": 2, "probability": 80 },
    { "id": "stg_4", "title": "Venta Ganada / Cerrada", "color": "#10b981", "order": 3, "probability": 100 }
  ],
  "contactFields": [
    { "id": "fld_c1", "key": "tipoCliente", "label": "Tipo de Cliente", "type": "text", "entityType": "contact", "required": true }
  ],
  "dealFields": [
    { "id": "fld_d1", "key": "servicioInteres", "label": "Servicio de Interés", "type": "text", "entityType": "deal", "required": true }
  ],
  "botSystemPrompt": "Instrucciones detalladas para el bot de WhatsApp con IA según este negocio...",
  "theme": {
    "primaryColor": "#3b82f6",
    "secondaryColor": "#1d4ed8",
    "accentColor": "#60a5fa"
  }
}`;

    const userPrompt = `Negocio: ${businessName || 'Empresa'}. Descripción: ${businessDescription}`;

    // 1. Inferencia en Ollama VPS Local / Ollama
    if (ollamaUrl) {
      try {
        const ollamaRes = await fetch(`${ollamaUrl.replace(/\/$/, '')}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: modelName || 'qwen2.5:1.5b',
            system: systemPrompt,
            prompt: userPrompt,
            format: 'json',
            stream: false,
          }),
          signal: AbortSignal.timeout(6000),
        });

        if (ollamaRes.ok) {
          const data = await ollamaRes.json();
          if (data.response) {
            const parsed = typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
            return NextResponse.json({ schema: parsed, source: 'gpu_colab' });
          }
        }
      } catch (err) {
        console.warn('Ollama fallback en analyze-business:', err);
      }
    }

    // 2. Inferencia en Groq Cloud API
    if (groqKey) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${groqKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.1-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2,
          }),
          signal: AbortSignal.timeout(8000),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            return NextResponse.json({ schema: parsed, source: 'groq_ai' });
          }
        }
      } catch (err) {
        console.warn('Groq error en analyze-business:', err);
      }
    }

    // 3. Fallback Heurístico Estructurado
    const bDesc = businessDescription.toLowerCase();
    let industryName = 'Comercio & Servicios';
    let primaryColor = '#3b82f6';
    let contactsTitle = 'Contactos';
    let dealsTitle = 'Oportunidades';

    if (bDesc.includes('dental') || bDesc.includes('salud') || bDesc.includes('medico') || bDesc.includes('clinica')) {
      industryName = 'Salud & Clínicas';
      primaryColor = '#10b981';
      contactsTitle = 'Pacientes';
      dealsTitle = 'Citas Médicas';
    } else if (bDesc.includes('pizza') || bDesc.includes('restaurante') || bDesc.includes('comida') || bDesc.includes('dark kitchen')) {
      industryName = 'Gastronomía & Dark Kitchen';
      primaryColor = '#ea580c';
      contactsTitle = 'Comensales';
      dealsTitle = 'Pedidos';
    } else if (bDesc.includes('inmueble') || bDesc.includes('inmobiliaria') || bDesc.includes('casa') || bDesc.includes('terreno')) {
      industryName = 'Bienes Raíces & Inmobiliaria';
      primaryColor = '#0284c7';
      contactsTitle = 'Compradores / Inquilinos';
      dealsTitle = 'Propiedades en Negociación';
    }

    const fallbackSchema = {
      industryName,
      detectedRubro: industryName,
      description: `Esquema adaptado para ${businessName || 'la empresa'}.`,
      terminology: {
        contactsTitle,
        contactSingle: contactsTitle.slice(0, -1),
        dealsTitle,
        dealSingle: dealsTitle.slice(0, -1),
        pipelineTitle: `Embudo de ${dealsTitle}`,
      },
      stages: [
        { id: 'stg_1', title: 'Nuevo Lead', color: primaryColor, order: 0, probability: 20 },
        { id: 'stg_2', title: 'Calificación / Consulta', color: '#8b5cf6', order: 1, probability: 40 },
        { id: 'stg_3', title: 'Propuesta / Cotización', color: '#f59e0b', order: 2, probability: 70 },
        { id: 'stg_4', title: 'Cierre Exitoso', color: '#10b981', order: 3, probability: 100 },
      ],
      contactFields: [
        { id: 'fld_c1', key: 'origenLead', label: 'Canal de Captura', type: 'text', entityType: 'contact', required: true }
      ],
      dealFields: [
        { id: 'fld_d1', key: 'montoEstimado', label: 'Monto Estimado (PEN)', type: 'number', entityType: 'deal', required: true }
      ],
      botSystemPrompt: `Eres el asistente de atención para ${businessName || 'la empresa'}. Responde con cordialidad y ayuda a registrar cotizaciones y pedidos.`,
      theme: {
        primaryColor,
        secondaryColor: '#1e293b',
        accentColor: '#38bdf8',
      },
    };

    return NextResponse.json({ schema: fallbackSchema, source: 'heuristic_engine' });
  } catch (error: any) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
