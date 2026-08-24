import { NextResponse } from 'next/server';

// Verificación inicial del Webhook por Meta
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN || 'crm_universal_webhook_secure_token_2026';

  if (mode === 'subscribe' && token === expectedToken) {
    return new Response(challenge, { status: 200 });
  }

  return NextResponse.json({ error: 'Token de verificación inválido' }, { status: 403 });
}

// Recepción de mensajes entrantes de WhatsApp
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Estructura de evento Meta Cloud API
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message) {
      const fromPhone = message.from;
      const textBody = message.text?.body || '';

      console.log(`[WhatsApp Webhook] Mensaje recibido de ${fromPhone}: ${textBody}`);
      // Aquí se procesa y guarda el mensaje con el adaptador de Storage o Firestore
    }

    return NextResponse.json({ status: 'success', received: true });
  } catch (err) {
    return NextResponse.json({ error: 'Error procesando webhook' }, { status: 500 });
  }
}
