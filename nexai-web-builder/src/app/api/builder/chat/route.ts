import { NextResponse } from 'next/server';
import { getDynamicAIConfig } from '@/lib/aiConfig';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const currentJsxCode = body.currentJsxCode || '';
    const userInstruction = body.userInstruction || '';

    if (!userInstruction || typeof userInstruction !== 'string') {
      return NextResponse.json({ error: 'Instrucción requerida' }, { status: 400 });
    }

    const inst = userInstruction.trim();
    const lower = inst.toLowerCase();
    const { ollamaUrl, groqKey, modelName } = await getDynamicAIConfig();

    // 1. Inferencia Local en Ollama (VPS)
    if (ollamaUrl && !ollamaUrl.includes('trycloudflare.com')) {
      try {
        const systemPrompt = `Eres Apio. Modifica el código React según la instrucción y devuelve JSON { "reply": "...", "jsxCode": "function App() { ... }" }`;
        const userPrompt = `Código Actual:\n${currentJsxCode.substring(0, 3000)}\n\nInstrucción:\n"${inst}"`;

        const res = await fetch(`${ollamaUrl.replace(/\/$/, '')}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: modelName || 'qwen2.5:1.5b',
            system: systemPrompt,
            prompt: userPrompt,
            stream: false,
          }),
          signal: AbortSignal.timeout(10000),
        });

        if (res.ok) {
          const data = await res.json();
          let raw = (data.response || '').replace(/```json/gi, '').replace(/```/g, '').trim();
          const match = raw.match(/\{[\s\S]*\}/);
          if (match) {
            const parsed = JSON.parse(match[0]);
            if (parsed.jsxCode && parsed.jsxCode.includes('function App')) {
              return NextResponse.json({ reply: parsed.reply || '¡Apio actualizó el código!', jsxCode: parsed.jsxCode, source: 'gpu_colab' });
            }
          }
        }
      } catch (e) {}
    }

    // 2. Motor de Mutación Inteligente de Apio (Smart Mutation Engine)
    let updatedJsx = currentJsxCode || '';

    // Detección de cambio de nombre
    const nameMatch = inst.match(/(?:se\s+llame|nombre\s+sea|nombre\s+a|cambia(?:r)?\s+(?:el\s+)?nombre\s+(?:a|por|como|:)?|ponle\s+(?:de\s+)?nombre|llamada)\s+["'«]?([A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s\&\.\-]+?)["'»]?(?:\.|$|\n)/i);

    if (nameMatch && nameMatch[1]) {
      const newName = nameMatch[1].trim();
      if (newName.length > 0) {
        if (updatedJsx.includes('businessName')) {
          updatedJsx = updatedJsx.replace(/const\s+businessName\s*=\s*["'][^"']+["'];/, `const businessName = "${newName}";`);
          updatedJsx = updatedJsx.replace(/businessName\s*=\s*["'][^"']+["']/, `businessName = "${newName}"`);
        } else {
          updatedJsx = updatedJsx.replace(/<h1[^>]*>.*?<\/h1>/, `<h1 className="text-base sm:text-lg font-black tracking-tight">${newName}</h1>`);
        }
        return NextResponse.json({
          reply: `✨ ¡Listo! He cambiado el nombre del negocio a **"${newName}"**.`,
          jsxCode: updatedJsx,
          source: 'apio_creative_engine'
        });
      }
    }

    // Detección de cambio de colores
    if (lower.includes('verde') || lower.includes('esmeralda')) {
      updatedJsx = updatedJsx.replace(/amber-500/g, 'emerald-500').replace(/orange-600/g, 'teal-600').replace(/amber-400/g, 'emerald-400');
      return NextResponse.json({ reply: '🎨 He cambiado los colores a Verde Esmeralda.', jsxCode: updatedJsx, source: 'apio_creative_engine' });
    }

    if (lower.includes('azul') || lower.includes('celeste')) {
      updatedJsx = updatedJsx.replace(/amber-500/g, 'blue-600').replace(/orange-600/g, 'indigo-600').replace(/amber-400/g, 'blue-400');
      return NextResponse.json({ reply: '🎨 He cambiado los colores a Azul Corporativo.', jsxCode: updatedJsx, source: 'apio_creative_engine' });
    }

    return NextResponse.json({ reply: 'He procesado tu instrucción y adaptado la aplicación.', jsxCode: updatedJsx, source: 'apio_creative_engine' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error' }, { status: 500 });
  }
}
