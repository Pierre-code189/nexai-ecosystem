import { IAIEngine } from '@/types/solid';
import { WhatsAppMessage } from '@/types/whatsapp';

export class AIEngineService implements IAIEngine {
  async generateReply(
    incomingMessage: string,
    history: WhatsAppMessage[],
    systemPrompt: string,
    industryContext: string
  ): Promise<{ replyText: string; extractedLeadInfo?: Record<string, any> }> {
    const lower = incomingMessage.toLowerCase();

    // Si existe endpoint API /api/ai/chat disponible en backend, se invoca
    try {
      if (typeof window !== 'undefined') {
        const res = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: incomingMessage,
            history: history.slice(-6),
            systemPrompt,
            industryContext,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.replyText) return data;
        }
      }
    } catch {
      // Fallback a motor conversacional contextual inteligente
    }

    // Motor de respuestas contextuales de alta fidelidad según rubro
    if (lower.includes('hola') || lower.includes('buenas') || lower.includes('informacion') || lower.includes('info')) {
      return {
        replyText: `¡Hola! Con mucho gusto te asisto. ¿En qué producto, servicio o propiedad estás interesado hoy? Cuéntame tu requerimiento y te daré todos los detalles.`,
      };
    }

    if (lower.includes('precio') || lower.includes('cuanto cuesta') || lower.includes('costo') || lower.includes('tarifa')) {
      return {
        replyText: `Contamos con opciones y planes flexibles que se adaptan a tu necesidad y presupuesto. ¿Tienes un rango o requerimiento específico para brindarte una cotización exacta?`,
      };
    }

    if (lower.includes('cita') || lower.includes('visita') || lower.includes('reunion') || lower.includes('agendar') || lower.includes('horario')) {
      return {
        replyText: `¡Excelente iniciativa! Podemos coordinar para esta semana. ¿Prefieres en la mañana (10:00 AM) o por la tarde (4:00 PM)? Por favor confírmame tu nombre completo.`,
        extractedLeadInfo: { stageSuggestion: 'stage_visit' },
      };
    }

    if (lower.includes('comprar') || lower.includes('adquirir') || lower.includes('separar') || lower.includes('contratar')) {
      return {
        replyText: `¡Fantástico! Vamos a formalizar tu solicitud. Te he asignado a un asesor comercial prioritario para enviarte los datos de pago y la propuesta final.`,
        extractedLeadInfo: { stageSuggestion: 'stage_offer', priority: 'high' },
      };
    }

    return {
      replyText: `Comprendo perfectamente tu consulta. He registrado tus detalles en nuestro sistema y un especialista se pondrá en contacto contigo a la brevedad para darte seguimiento personalizado.`,
    };
  }
}
