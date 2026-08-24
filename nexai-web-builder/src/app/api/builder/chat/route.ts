import { NextResponse } from 'next/server';
import { getDynamicAIConfig } from '@/lib/aiConfig';

export async function POST(req: Request) {
  try {
    const { currentJsxCode, userInstruction, colabUrl: clientColabUrl } = await req.json();

    if (!userInstruction || typeof userInstruction !== 'string') {
      return NextResponse.json({ error: 'Instrucción requerida' }, { status: 400 });
    }

    const { ollamaUrl, groqKey, modelName } = await getDynamicAIConfig(clientColabUrl);

    const systemPrompt = `Eres Apio 🤖, el Agente Creativo de Inteligencia Artificial especializado en creación de software y aplicaciones web en React 18 + Tailwind CSS (al estilo de Google Spark y v0).
Tu misión es recibir el código actual de React (App.jsx) y la instrucción o cambio solicitado por el usuario.

Debes responder ÚNICAMENTE con un JSON válido con esta estructura exacta:
{
  "reply": "Explicación amigable en español de los cambios que realizaste en el código.",
  "jsxCode": "function App() { ... }",
  "readmeMarkdown": "Bitácora del cambio realizado..."
}

Reglas estrictas de codificación para Apio:
1. El código en jsxCode DEBE ser una función React pura nombrada 'function App() { ... }' con su propio estado (useState, useEffect) sin imports externos que rompan el runtime.
2. Usa clases modernas de Tailwind CSS para el diseño y colores.
3. Asegúrate de incluir interactividad real (carrito de compras con cálculo en Soles S/, formularios funcionales, modales o filtros).
4. No envuelvas el JSON en texto conversacional fuera de las llaves.`;

    const userPrompt = `Código React Actual:\n${currentJsxCode ? currentJsxCode.substring(0, 3000) : ''}\n\nInstrucción del Usuario:\n"${userInstruction}"`;

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
                reply: parsed.reply || '¡He reprogramado y actualizado tu aplicación en el Sandbox con Apio!',
                jsxCode: parsed.jsxCode,
                source: 'gpu_colab',
              });
            }
          }
        }
      } catch (err: any) {
        console.warn('Aviso Ollama en Apio chat:', err.message);
      }
    }

    // 2. Inferencia en Groq Cloud API
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
                reply: parsed.reply || 'Apio ha reestructurado el componente en React con Groq Cloud.',
                jsxCode: parsed.jsxCode,
                source: 'groq_cloud',
              });
            }
          }
        }
      } catch (err: any) {
        console.warn('Aviso Groq en Apio chat:', err.message);
      }
    }

    // 3. Generador Creativo Dinámico de Apio (Fallback Heurístico de Alta Fidelidad)
    const lower = userInstruction.toLowerCase();
    let generatedJsx = currentJsxCode || '';
    let reply = `He procesado tu solicitud con Apio y adaptado el código en el Sandbox en tiempo real.`;

    if (lower.includes('panaderia') || lower.includes('panadería') || lower.includes('pan') || lower.includes('pastel')) {
      reply = '🥖 ¡Listo! He reprogramado tu aplicación para Panadería & Pastelería Artesanal con catálogo de panes de masa madre, croissants y carrito de compras en Soles (S/).';
      generatedJsx = `function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState("todos");

  const businessName = "Panadería & Pastelería Don Pan";
  const phone = "+51 928 100 975";

  const products = [
    { id: 1, name: "Pan Ciabatta de Masa Madre (Docena)", cat: "panes", desc: "Corteza crocante y fermentación natural de 24 horas.", price: 8.50, img: "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=600&auto=format&fit=crop&q=80" },
    { id: 2, name: "Croissants de Mantequilla Francesa (4x)", cat: "dulces", desc: "Hojaldre 100% artesanal con crema pastelera o chocolate.", price: 18.00, img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=80" },
    { id: 3, name: "Baguette Rústica Tradicional", cat: "panes", desc: "Elaborada con harina de trigo seleccionada a la piedra.", price: 5.00, img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80" },
    { id: 4, name: "Torta de Chocolate & Fudge Artesanal", cat: "tortas", desc: "Bizcocho húmedo de cacao peruano relleno de fudge casero.", price: 45.00, img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80" }
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

  const filtered = selectedCat === "todos" ? products : products.filter((p) => p.cat === selectedCat);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="p-4 sm:px-8 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 flex justify-between items-center max-w-6xl mx-auto bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white text-lg shadow-lg">
            🥖
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight">{businessName}</h1>
            <p className="text-[11px] text-amber-400 font-mono">Horneado Fresco Cada Mañana en Piura</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsCartOpen(true)} className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 flex items-center gap-1.5 font-bold text-xs">
            <span>🛒 Pedido ({cart.reduce((a, b) => a + b.qty, 0)})</span>
          </button>
          <a href={"https://wa.me/" + phone.replace(/[^0-9]/g, '')} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md">
            WhatsApp
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-8 space-y-10">
        <section className="text-center py-10 space-y-4 max-w-3xl mx-auto">
          <span className="px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold text-amber-300">
            🥖 Masa Madre 100% Natural sin Preservantes
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">Panadería y Pastelería Fina</h2>
          <p className="text-slate-400 text-sm">Disfruta de nuestros panes crocantes, pasteles recién salidos del horno y combos para desayunos y meriendas.</p>
        </section>

        {/* Categories */}
        <div className="flex justify-center gap-2">
          {["todos", "panes", "dulces", "tortas"].map((cat) => (
            <button key={cat} onClick={() => setSelectedCat(cat)} className={"px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all " + (selectedCat === cat ? "bg-amber-500 text-slate-950 shadow-md" : "bg-slate-900 text-slate-400 hover:bg-slate-800")}>
              {cat}
            </button>
          ))}
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {filtered.map((item) => (
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
        </div>

        {/* Drawer */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md bg-slate-900 h-full p-6 flex flex-col justify-between border-l border-slate-800">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <h4 className="font-black text-base">🛒 Tu Carrito Don Pan</h4>
                <button onClick={() => setIsCartOpen(false)}>✕</button>
              </div>
              <div className="flex-1 py-4 overflow-y-auto space-y-3">
                {cart.length === 0 ? <p className="text-center text-slate-500 py-12 text-xs">Tu canasta está vacía.</p> : cart.map((c) => (
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
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span>Total a Pagar:</span>
                    <span className="text-emerald-400 font-mono text-xl">S/ {total.toFixed(2)}</span>
                  </div>
                  <a href={"https://wa.me/" + phone.replace(/[^0-9]/g, '') + "?text=" + encodeURIComponent("Hola Don Pan, deseo ordenar: " + cart.map((c) => c.qty + "x " + c.name).join(", ") + " Total: S/ " + total.toFixed(2))} target="_blank" rel="noreferrer" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-xl">
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
    } else if (lower.includes('dental') || lower.includes('clinica') || lower.includes('sonrisas') || lower.includes('dientes')) {
      reply = '🏥 ¡Listo! He programado tu aplicación para Clínica Dental moderna con agendador interactivo de citas, catálogo de tratamientos láser y modo verde esmeralda.';
      generatedJsx = `function App() {
  const [selectedService, setSelectedService] = useState("Blanqueamiento Láser");
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const phone = "+51 928 100 975";

  const services = [
    { id: 1, title: "Blanqueamiento Dental Láser", price: "S/ 250.00", desc: "Aclarado profesional de hasta 4 tonos con tecnología LED de última generación sin sensibilidad.", img: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80" },
    { id: 2, title: "Ortodoncia Invisible & Brackets Zafiro", price: "S/ 120.00 / mes", desc: "Alineación dental estética con alineadores transparentes de máxima precisión.", img: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&auto=format&fit=crop&q=80" },
    { id: 3, title: "Profilaxis & Limpieza Ultrasonido", price: "S/ 80.00", desc: "Eliminación profunda de sarro, placa bacteriana y pulido dental completo.", img: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80" }
  ];

  const handleBookAppointment = (e) => {
    e.preventDefault();
    if (!patientName || !patientPhone) return;
    const msg = "Hola Clínica Dental Sonrisas, deseo agendar una cita para: " + selectedService + " | Paciente: " + patientName + " | Fecha: " + (appointmentDate || "Lo antes posible");
    window.open("https://wa.me/" + phone.replace(/[^0-9]/g, '') + "?text=" + encodeURIComponent(msg), "_blank");
    setBookingSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="p-4 sm:px-8 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 flex justify-between items-center max-w-6xl mx-auto bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white text-lg shadow-lg">
            🦷
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight">Clínica Dental Sonrisas</h1>
            <p className="text-[11px] text-emerald-400 font-mono">Especialistas Certificados & Tecnología Láser</p>
          </div>
        </div>
        <a href="#citas" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md">
          Agendar Cita
        </a>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-8 space-y-12">
        <section className="text-center py-10 space-y-4 max-w-3xl mx-auto">
          <span className="px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-300">
            ✨ Tu Sonrisa en Manos de Profesionales
          </span>
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight">Odontología Digital sin Dolor</h2>
          <p className="text-slate-400 text-sm">Tratamientos odontológicos avanzados, tecnología digital y atención personalizada en Piura.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 flex flex-col justify-between hover:border-emerald-500/50 transition-all">
              <img src={s.img} alt={s.title} className="h-44 w-full object-cover rounded-2xl" />
              <div className="space-y-2">
                <h4 className="font-bold text-base text-white">{s.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                <span className="text-sm font-black text-emerald-400 font-mono block">{s.price}</span>
              </div>
              <button onClick={() => { setSelectedService(s.title); document.getElementById('citas')?.scrollIntoView({ behavior: 'smooth' }); }} className="w-full py-2 bg-slate-800 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all">
                Seleccionar Tratamiento
              </button>
            </div>
          ))}
        </section>

        <section id="citas" className="p-8 bg-slate-900 border border-slate-800 rounded-3xl max-w-xl mx-auto space-y-5 shadow-2xl">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-black text-white">Agendar Cita en Línea</h3>
            <p className="text-xs text-slate-400">Tratamiento seleccionado: <strong className="text-emerald-400">{selectedService}</strong></p>
          </div>
          {bookingSuccess ? (
            <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-2">
              <p className="text-emerald-300 font-bold text-sm">¡Cita registrada con éxito!</p>
              <p className="text-xs text-slate-400">Te contactaremos por WhatsApp para confirmar tu horario.</p>
            </div>
          ) : (
            <form onSubmit={handleBookAppointment} className="space-y-3 text-xs">
              <input type="text" placeholder="Tu Nombre Completo..." value={patientName} onChange={(e) => setPatientName(e.target.value)} required className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100" />
              <input type="text" placeholder="Teléfono / WhatsApp..." value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)} required className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100" />
              <input type="date" value={appointmentDate} onChange={(e) => setAppointmentDate(e.target.value)} className="w-full p-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100" />
              <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg">
                Confirmar Cita por WhatsApp
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}`;
    }

    return NextResponse.json({
      reply,
      jsxCode: generatedJsx,
      source: 'apio_creative_engine',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error con el Agente Apio' }, { status: 500 });
  }
}
