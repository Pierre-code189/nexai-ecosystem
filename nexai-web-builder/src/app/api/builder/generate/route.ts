import { NextResponse } from 'next/server';
import { getDynamicAIConfig } from '@/lib/aiConfig';

export async function POST(req: Request) {
  try {
    const { prompt, businessName, colabUrl: clientColabUrl } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt requerido' }, { status: 400 });
    }

    const { ollamaUrl, groqKey, modelName } = await getDynamicAIConfig(clientColabUrl);

    const systemPrompt = `Eres Apio 🤖, el Agente Creativo de Inteligencia Artificial para creación de software y sitios web interactivos en React 18 + Tailwind CSS.
Recibes la idea de un negocio y debes escribir un componente completo y autosuficiente en React 18 nombrado 'function App() { ... }'.

Debes responder ÚNICAMENTE con un JSON válido con esta estructura:
{
  "title": "Nombre de la Aplicación",
  "reply": "Explicación concisa de lo creado por Apio.",
  "jsxCode": "function App() { ... }",
  "readmeMarkdown": "Especificación del proyecto..."
}`;

    const userPrompt = `Idea del Usuario: "${prompt}". Nombre Sugerido: "${businessName || ''}"`;

    // 1. Inferencia en Ollama Local (VPS)
    if (ollamaUrl) {
      try {
        const ollamaRes = await fetch(`${ollamaUrl.replace(/\/$/, '')}/api/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: modelName || 'qwen2.5:1.5b',
            system: systemPrompt,
            prompt: userPrompt,
            stream: false,
          }),
          signal: AbortSignal.timeout(25000),
        });

        if (ollamaRes.ok) {
          const data = await ollamaRes.json();
          let rawResp = data.response || '';
          rawResp = rawResp.replace(/```json/gi, '').replace(/```/g, '').trim();
          const jsonMatch = rawResp.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            if (parsed.jsxCode) {
              return NextResponse.json({
                title: parsed.title || businessName || 'Mi Aplicación React',
                reply: parsed.reply || 'Apio ha generado tu aplicación en React 18.',
                jsxCode: parsed.jsxCode,
                source: 'gpu_colab',
              });
            }
          }
        }
      } catch (e: any) {
        console.warn('Aviso Ollama generate:', e.message);
      }
    }

    // 2. Groq Cloud Fallback
    if (groqKey) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
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
          signal: AbortSignal.timeout(10000),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const content = data.choices?.[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            if (parsed.jsxCode) {
              return NextResponse.json({
                title: parsed.title || businessName || 'Mi Aplicación React',
                reply: parsed.reply || 'Apio ha generado tu aplicación con Groq Cloud.',
                jsxCode: parsed.jsxCode,
                source: 'groq_ai',
              });
            }
          }
        }
      } catch (err: any) {
        console.warn('Aviso Groq generate:', err.message);
      }
    }

    // 3. Fallback Creativo Estructurado de Apio
    const bName = businessName || 'Kira\'s Pizza & Panadería Artesanal';
    const initialJsx = `function App() {
  const [cart, setCart] = useState([]);
  const [isDark, setIsDark] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const businessName = "${bName}";
  const phone = "+51 928 100 975";

  const products = [
    { id: 1, name: "Pizza Napolitana Suprema", desc: "Masa madre 48h, mozzarella fior di latte y albahaca.", price: 42.00, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80" },
    { id: 2, name: "Pan Ciabatta Artesanal (Docena)", desc: "Corteza crocante y fermentación natural sin químicos.", price: 8.50, img: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&auto=format&fit=crop&q=80" },
    { id: 3, name: "Croissants de Mantequilla (4x)", desc: "Hojaldre 100% artesanal relleno de crema pastelera o chocolate.", price: 18.00, img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80" },
    { id: 4, name: "Combo Familiar Duetto + Bebida", desc: "2 Pizzas Grandes + Pan al Ajo con Queso + Gaseosa 1.5L.", price: 69.90, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80" }
  ];

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((c) => c.id === item.id);
      if (exists) return prev.map((c) => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...item, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, qty: Math.max(0, c.qty + delta) } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className={isDark ? "min-h-screen bg-slate-950 text-slate-100 font-sans" : "min-h-screen bg-slate-50 text-slate-900 font-sans"}>
      <header className="p-4 sm:px-8 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 flex justify-between items-center max-w-6xl mx-auto bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
            🍕
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight">{businessName}</h1>
            <p className="text-[11px] text-amber-400 font-mono">100% Masa Madre & Horneado Diario</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-xl border border-slate-700 text-slate-300">
            {isDark ? "☀️" : "🌙"}
          </button>
          <button onClick={() => setIsCartOpen(true)} className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-bold text-xs">
            🛒 Carrito ({cart.reduce((a, b) => a + b.qty, 0)})
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-8 space-y-12">
        <section className="text-center py-12 space-y-4 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold text-amber-300">
            ✨ Horneado Fresco y Masa Madre de 48 Horas
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">El Auténtico Sabor en Piura</h2>
          <p className="text-sm text-slate-400">Ingredientes seleccionados, masa madre de fermentación natural y entrega directa por WhatsApp.</p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((item) => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-amber-500/40 transition-all">
              <img src={item.img} alt={item.name} className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-sm text-white">{item.name}</h4>
                  <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                </div>
                <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-sm font-black text-emerald-400 font-mono">S/ {item.price.toFixed(2)}</span>
                  <button onClick={() => addToCart(item)} className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow active:scale-95 transition-all">
                    + Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 h-full p-6 flex flex-col justify-between border-l border-slate-800">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <h4 className="font-black text-base">🛒 Tu Carrito de Compras</h4>
                <button onClick={() => setIsCartOpen(false)}>✕</button>
              </div>
              <div className="flex-1 py-4 overflow-y-auto space-y-3">
                {cart.length === 0 ? <p className="text-center text-slate-500 py-12 text-xs">El carrito está vacío.</p> : cart.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
                    <div>
                      <p className="font-bold text-xs">{c.name}</p>
                      <span className="text-xs text-emerald-400 font-mono">S/ {(c.price * c.qty).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 px-2 py-1 rounded-xl">
                      <button onClick={() => updateQty(c.id, -1)} className="px-1.5 font-bold">-</button>
                      <span className="text-xs">{c.qty}</span>
                      <button onClick={() => updateQty(c.id, 1)} className="px-1.5 font-bold">+</button>
                    </div>
                  </div>
                ))}
              </div>
              {cart.length > 0 && (
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-base font-black">
                    <span>Total:</span>
                    <span className="text-emerald-400 font-mono text-xl">S/ {total.toFixed(2)}</span>
                  </div>
                  <a href={"https://wa.me/" + phone.replace(/[^0-9]/g, '') + "?text=" + encodeURIComponent("Hola " + businessName + ", deseo confirmar mi pedido de: " + cart.map((c) => c.qty + "x " + c.name).join(", ") + " Total: S/ " + total.toFixed(2))} target="_blank" rel="noreferrer" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl flex items-center justify-center shadow-xl">
                    Pagar con Yape / Plin por WhatsApp
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}`;

    return NextResponse.json({
      title: bName,
      reply: 'Apio ha generado la estructura inicial de tu aplicación React.',
      jsxCode: initialJsx,
      source: 'apio_creative_engine',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error generando con Apio' }, { status: 500 });
  }
}
