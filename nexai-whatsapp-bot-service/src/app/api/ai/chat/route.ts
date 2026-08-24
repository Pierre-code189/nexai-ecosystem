import { NextResponse } from 'next/server';
import { getDynamicAIConfig } from '@/lib/aiConfig';

export async function POST(req: Request) {
  try {
    const { message, history, systemPrompt, industryContext, colabUrl: clientColabUrl } = await req.json();

    const { ollamaUrl, groqKey, modelName } = await getDynamicAIConfig(clientColabUrl);

    const lower = (message || '').toLowerCase();
    const isComplex = lower.includes('contrato') || lower.includes('negociar') || lower.includes('descuento especial') || lower.includes('presupuesto personalizado');
    const groqModel = isComplex ? 'llama-3.1-70b-versatile' : 'qwen2.5:1.5b-instant';

    // 1. Inferencia con GPU Colab / Ollama
    if (ollamaUrl) {
      try {
        const ollamaRes = await fetch(`${ollamaUrl.replace(/\/$/, '')}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: modelName || 'qwen2.5:1.5b',
            system: `${systemPrompt || 'Eres un asistente comercial de ventas.'}\nRubro: ${industryContext || 'General'}. Responde conciso y en español peruano natural.`,
            prompt: message,
            stream: false,
          }),
          signal: AbortSignal.timeout(6000),
        });

        if (ollamaRes.ok) {
          const data = await ollamaRes.json();
          if (data.response) {
            return NextResponse.json({ replyText: data.response, modelUsed: 'gpu_colab' });
          }
        }
      } catch (err) {
        console.warn('Ollama no disponible en WhatsApp chat, pasando a Groq:', err);
      }
    }

    // 2. Inferencia con Groq Cloud API
    if (groqKey) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${groqKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: groqModel,
            messages: [
              { role: 'system', content: `${systemPrompt || 'Eres un asistente comercial de ventas.'}\nRubro: ${industryContext || 'General'}. Responde conciso y en español peruano natural.` },
              ...((history || []).map((h: any) => ({
                role: h.sender === 'user' ? 'user' : 'assistant',
                content: h.text,
              }))),
              { role: 'user', content: message },
            ],
            temperature: 0.3,
            max_tokens: 150,
          }),
          signal: AbortSignal.timeout(8000),
        });

        if (response.ok) {
          const data = await response.json();
          const replyText = data.choices?.[0]?.message?.content;
          if (replyText) return NextResponse.json({ replyText, modelUsed: groqModel });
        }
      } catch (err) {
        console.warn('Groq error en WhatsApp chat:', err);
      }
    }

    return NextResponse.json({
      replyText: `¡Hola! Con mucho gusto te atendemos respecto a "${message.substring(0, 40)}". En un momento formalizamos tu pedido o consulta.`,
      modelUsed: 'local_fallback',
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
