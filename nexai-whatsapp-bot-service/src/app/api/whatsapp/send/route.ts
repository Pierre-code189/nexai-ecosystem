import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { toPhone, text } = await req.json();
    const token = process.env.WHATSAPP_API_TOKEN;
    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneId) {
      // Modo simulación si no hay credenciales Meta en backend
      return NextResponse.json({
        success: true,
        mode: 'simulated',
        toPhone,
        text,
        message: 'Mensaje despachado en modo simulación.',
      });
    }

    const res = await fetch(`https://graph.facebook.com/v19.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: toPhone,
        type: 'text',
        text: { body: text },
      }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Fallo al enviar mensaje WhatsApp' }, { status: 500 });
  }
}
