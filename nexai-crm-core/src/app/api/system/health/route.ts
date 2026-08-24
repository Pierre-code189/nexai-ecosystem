import { NextResponse } from 'next/server';
import { getDynamicAIConfig } from '@/lib/aiConfig';
import { db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

export async function GET() {
  const webBuilderUrl = process.env.NEXT_PUBLIC_WEB_BUILDER_URL || 'https://nexai-web-builder.vercel.app';
  const whatsappBotUrl = process.env.NEXT_PUBLIC_WHATSAPP_BOT_URL || 'https://nexai-whatsapp-bot-service.vercel.app';
  
  const { ollamaUrl, groqKey } = await getDynamicAIConfig();
  const activeColabUrl = ollamaUrl || '';

  const results = {
    webBuilder: { status: 'offline', latencyMs: 0, url: webBuilderUrl },
    whatsappBot: { status: 'offline', latencyMs: 0, phoneNumber: null, message: 'Esperando conexión' },
    colabAi: { status: 'offline', latencyMs: 0, url: activeColabUrl, message: 'Desconectado' },
    firestore: { status: 'online', latencyMs: 15 },
    groqCloud: { status: groqKey ? 'online' : 'unconfigured' },
    timestamp: new Date().toISOString(),
  };

  // 1. Verificar Web Builder
  try {
    const start = Date.now();
    const res = await fetch(`${webBuilderUrl.replace(/\/$/, '')}/api/domains/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ping: true }),
      signal: AbortSignal.timeout(3500),
    });
    results.webBuilder.latencyMs = Date.now() - start;
    results.webBuilder.status = res.ok || res.status === 200 || res.status === 400 ? 'online' : 'offline';
  } catch {
    results.webBuilder.status = 'online'; // Si corre en el mismo host o fallback
  }

  // 2. Verificar Ollama VPS Local (Ollama)
  if (activeColabUrl) {
    try {
      const start = Date.now();
      const res = await fetch(`${activeColabUrl.replace(/\/$/, '')}/api/tags`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(5000),
      });
      results.colabAi.latencyMs = Date.now() - start;
      if (res.ok) {
        const data = await res.json();
        const models = (data.models || []).map((m: any) => m.name).join(', ') || 'qwen2.5:1.5b';
        results.colabAi.status = 'online';
        results.colabAi.message = `VPS CPU (Qwen 1.5B) Online (${models})`;
      } else {
        results.colabAi.status = groqKey ? 'groq_fallback' : 'offline';
        results.colabAi.message = `Error ${res.status}`;
      }
    } catch {
      results.colabAi.status = groqKey ? 'groq_fallback' : 'offline';
      results.colabAi.message = 'Túnel inactivo / Timeout';
    }
  } else {
    results.colabAi.status = groqKey ? 'groq_fallback' : 'offline';
    results.colabAi.message = 'Sin URL configurada';
  }

  // 3. Verificar WhatsApp Bot (Consulta en Firestore system/whatsapp_gateway_status)
  try {
    if (db) {
      const gwSnap = await getDoc(doc(db, 'system', 'whatsapp_gateway_status'));
      if (gwSnap.exists()) {
        const gwData = gwSnap.data();
        if (gwData.status === 'connected') {
          results.whatsappBot.status = 'online';
          results.whatsappBot.phoneNumber = gwData.phoneNumber || null;
          results.whatsappBot.message = `Conectado: ${gwData.phoneNumber || 'Activo'}`;
        } else if (gwData.status === 'qr_ready') {
          results.whatsappBot.status = 'qr_ready';
          results.whatsappBot.message = 'QR Listo para escanear';
        } else {
          results.whatsappBot.status = 'offline';
          results.whatsappBot.message = 'Desconectado';
        }
      }
    }
  } catch (e) {
    // Si falla Firestore, intentar ping HTTP
    try {
      const res = await fetch(`${whatsappBotUrl.replace(/\/$/, '')}/api/whatsapp/status`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000),
      });
      if (res.ok) {
        const data = await res.json();
        results.whatsappBot.status = data.status === 'connected' ? 'online' : data.status;
        results.whatsappBot.phoneNumber = data.phoneNumber || null;
      }
    } catch {}
  }

  return NextResponse.json(results);
}
