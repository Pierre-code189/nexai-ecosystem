/**
 * Motor Determinista de Nivel 0 (Zero-Token Intent Engine).
 * Resuelve el 60-70% de las consultas habituales de WhatsApp SIN consumir ningún token de IA.
 */
export interface DeterministicResponse {
  matched: boolean;
  replyText?: string;
  extractedLeadInfo?: Record<string, any>;
  intentName?: string;
}

export class DeterministicNLPService {
  public matchIntent(message: string, businessName: string = 'nuestro negocio'): DeterministicResponse {
    const text = message.toLowerCase().trim();

    // 1. Saludos iniciales
    if (/^(hola|buenas|buenos dias|buenas tardes|buenas noches|que tal|info|informacion)$/i.test(text)) {
      return {
        matched: true,
        intentName: 'greeting',
        replyText: `¡Hola! Bienvenido/a a ${businessName}. ¿En qué producto, servicio o cotización te podemos ayudar hoy?`,
      };
    }

    // 2. Medios de pago
    if (text.includes('yape') || text.includes('plin') || text.includes('como pago') || text.includes('metodos de pago') || text.includes('bcp')) {
      return {
        matched: true,
        intentName: 'payment_methods',
        replyText: `Aceptamos Yape y Plin (969 123 456), transferencias bancarias BCP/Interbank y tarjetas de crédito/débito. ¿Deseas que te envíe los datos de cuenta?`,
      };
    }

    // 3. Ubicación y Horarios
    if (text.includes('donde estan') || text.includes('ubicacion') || text.includes('direccion') || text.includes('horario') || text.includes('atienden')) {
      return {
        matched: true,
        intentName: 'location_hours',
        replyText: `Estamos ubicados en Piura, Perú. Atendemos de Lunes a Domingo de 9:00 AM a 10:30 PM (delivery continuo).`,
      };
    }

    // 4. Intención explícita de compra / Pedido
    if (text.includes('quiero pedir') || text.includes('hacer pedido') || text.includes('comprar') || text.includes('separar')) {
      return {
        matched: true,
        intentName: 'order_intent',
        replyText: `¡Perfecto! Vamos a tomar tu orden de inmediato. Por favor indícanos el detalle de tu pedido y la dirección exacta de entrega.`,
        extractedLeadInfo: { stageSuggestion: 'stage_order', priority: 'high' },
      };
    }

    return { matched: false };
  }
}
