import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL requerida' }, { status: 400 });

    const target = url.replace(/\/$/, '');
    
    // Intentar /api/tags (Ollama)
    let res = await fetch(`${target}/api/tags`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      const models = (data.models || []).map((m: any) => m.name).join(', ') || 'qwen2.5:1.5b';
      return NextResponse.json({
        success: true,
        message: `¡Conexión Exitosa con VPS CPU (Qwen 1.5B)! Modelos disponibles: ${models}`,
        models: data.models,
      });
    }

    // Intentar /api/whatsapp/status (Gateway Baileys)
    res = await fetch(`${target}/api/whatsapp/status`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({
        success: true,
        message: `¡Conectado a Gateway Baileys + GPU! Estado WhatsApp: ${data.status || 'Activo'}`,
        whatsapp: data,
      });
    }

    return NextResponse.json({
      success: false,
      error: `Servidor respondió con código ${res.status}. Verifica que Ollama esté corriendo en Colab.`,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: `No se pudo conectar al túnel: ${err.message || 'Timeout de conexión'}`,
    });
  }
}
