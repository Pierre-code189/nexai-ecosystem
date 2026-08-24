'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LiveSandboxPreview } from '@/components/builder/LiveSandboxPreview';
import { CodeEditorTab } from '@/components/builder/CodeEditorTab';
import { AIChatAssistant } from '@/components/builder/AIChatAssistant';
import { WebsiteUpsellModal } from '@/components/builder/WebsiteUpsellModal';
import { downloadReactProjectZip } from '@/lib/exportReactProject';
import { Button } from '@/components/ui/Button';
import {
  Monitor,
  Tablet,
  Smartphone,
  Download,
  Zap,
  Globe,
  ArrowLeft,
  Sparkles,
  MessageSquare,
  Code2,
  FileCode,
  Save,
  Check,
  Play,
  RotateCcw,
} from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { doc, setDoc } from 'firebase/firestore';

export default function BuilderStudioPage() {
  const router = useRouter();
  const [projectTitle, setProjectTitle] = useState('Kira\'s Pizza Artesanal');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeSideTab, setActiveSideTab] = useState<'chat' | 'code' | 'readme'>('chat');
  const [isUpsellOpen, setIsUpsellOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [readmeDraft, setReadmeDraft] = useState('');
  const [isReadmeSaved, setIsReadmeSaved] = useState(false);

  // Código JSX Inicial por Defecto (Panadería / Pizzería Interactiva con Carrito y WhatsApp)
  const defaultAppCode = `function App() {
  const [cart, setCart] = useState([]);
  const [isDark, setIsDark] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  const businessName = "Kira's Pizza & Panadería Artesanal";
  const phone = "+51 928 100 975";

  const products = [
    { id: 1, name: "Pizza Napolitana Suprema", desc: "Masa madre 48h, mozzarella fior di latte, albahaca y pomodoro.", price: 42.00, img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80" },
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

  const handleCheckout = () => {
    const message = "Hola " + businessName + ", deseo confirmar mi pedido de: " +
      cart.map((c) => c.qty + "x " + c.name).join(", ") +
      " | Total a Pagar: S/ " + total.toFixed(2);
    window.open("https://wa.me/" + phone.replace(/[^0-9]/g, '') + "?text=" + encodeURIComponent(message), "_blank");
    setOrderSent(true);
    setTimeout(() => setOrderSent(false), 5000);
  };

  return (
    <div className={isDark ? "min-h-screen bg-slate-950 text-slate-100 font-sans" : "min-h-screen bg-slate-50 text-slate-900 font-sans"}>
      {/* Header */}
      <header className="p-4 sm:px-8 border-b border-slate-800 backdrop-blur-md sticky top-0 z-30 flex justify-between items-center max-w-6xl mx-auto bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-lg shadow-lg">
            🍕
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-black tracking-tight">{businessName}</h1>
            <p className="text-[11px] text-amber-400 font-mono font-semibold">100% Masa Madre & Horneado Diario</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300">
            {isDark ? "☀️ Claro" : "🌙 Oscuro"}
          </button>
          <button onClick={() => setIsCartOpen(true)} className="relative px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 flex items-center gap-1.5 font-bold text-xs">
            <span>🛒 Carrito</span>
            {cart.length > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[11px] px-2 py-0.2 rounded-full font-black">
                {cart.reduce((a, b) => a + b.qty, 0)}
              </span>
            )}
          </button>
          <a href={"https://wa.me/" + phone.replace(/[^0-9]/g, '')} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md">
            WhatsApp
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto p-4 sm:p-8 space-y-12">
        <section className="text-center py-10 sm:py-16 space-y-6 max-w-3xl mx-auto">
          <span className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-bold text-amber-300">
            ✨ Horneado Fresco y Masa Madre de 48 Horas
          </span>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            El Auténtico Sabor Artesanal en Piura
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Ingredientes seleccionados, masa madre de fermentación natural y entrega directa a tu puerta. Pide por WhatsApp y paga al instante con Yape o Plin.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <a href="#catalogo" className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-90 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-amber-500/20">
              Ver Catálogo & Carta
            </a>
            <a href="#contacto" className="px-6 py-3.5 bg-slate-900 border border-slate-700 text-slate-200 font-bold text-xs sm:text-sm rounded-2xl hover:bg-slate-800">
              Ubicación & Contacto
            </a>
          </div>
        </section>

        {/* Catalog */}
        <section id="catalogo" className="space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-black">Nuestros Productos Destacados</h3>
            <p className="text-xs text-slate-400">Selecciona y agrega directamente a tu carrito</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {products.map((item) => (
              <div key={item.id} className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group hover:border-amber-500/40 transition-all">
                <img src={item.img} alt={item.name} className="h-44 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-white">{item.name}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                    <span className="text-sm font-black text-emerald-400 font-mono">S/ {item.price.toFixed(2)}</span>
                    <button onClick={() => addToCart(item)} className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md active:scale-95 transition-all">
                      + Agregar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Floating Cart Drawer */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-slate-900 h-full p-6 flex flex-col justify-between border-l border-slate-800 shadow-2xl">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <h4 className="font-black text-base text-white">🛒 Tu Carrito de Compras</h4>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-lg">✕</button>
              </div>

              <div className="flex-1 py-4 overflow-y-auto space-y-3">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-slate-500 text-xs">El carrito está vacío.</div>
                ) : (
                  cart.map((c) => (
                    <div key={c.id} className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex justify-between items-center">
                      <div>
                        <h5 className="font-bold text-xs text-white">{c.name}</h5>
                        <span className="text-xs text-emerald-400 font-mono font-bold">S/ {(c.price * c.qty).toFixed(2)}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-900 px-2 py-1 rounded-xl border border-slate-700">
                        <button onClick={() => updateQty(c.id, -1)} className="text-slate-400 hover:text-white font-bold px-1.5">-</button>
                        <span className="text-xs font-bold text-white">{c.qty}</span>
                        <button onClick={() => updateQty(c.id, 1)} className="text-slate-400 hover:text-white font-bold px-1.5">+</button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex justify-between items-center text-base font-black text-white">
                    <span>Total a Pagar:</span>
                    <span className="text-emerald-400 font-mono text-xl">S/ {total.toFixed(2)}</span>
                  </div>
                  <button onClick={handleCheckout} className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-xl flex items-center justify-center gap-2">
                    <span>Confirmar & Pagar por WhatsApp (Yape / Plin)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}`;

  const [jsxCode, setJsxCode] = useState<string>(defaultAppCode);

  useEffect(() => {
    async function init() {
      if (typeof window !== 'undefined') {
        const savedPrompt = sessionStorage.getItem('builder_prompt');
        const savedName = sessionStorage.getItem('builder_bname');
        if (savedName) setProjectTitle(savedName);

        if (savedPrompt) {
          try {
            const res = await fetch('/api/builder/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ prompt: savedPrompt, businessName: savedName }),
            });
            if (res.ok) {
              const data = await res.json();
              if (data.jsxCode) {
                setJsxCode(data.jsxCode);
                if (data.title) setProjectTitle(data.title);
              }
            }
          } catch (e) {
            console.warn('Aviso generando código inicial con Apio:', e);
          }
        }
      }
    }
    init();
  }, []);

  const handleDownloadZip = async () => {
    setIsExporting(true);
    try {
      await downloadReactProjectZip(projectTitle, jsxCode, readmeDraft);
    } catch (e) {
      console.error('Error exportando proyecto:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleUpdateFromApio = (newJsx: string, explanation: string) => {
    setJsxCode(newJsx);
    // Auto-guardado en Firestore
    if (db) {
      const slug = projectTitle.toLowerCase().replace(/[^a-z0-9]/g, '-');
      setDoc(doc(db, 'websites', slug), {
        title: projectTitle,
        slug,
        jsxCode: newJsx,
        updatedAt: new Date().toISOString(),
      }, { merge: true }).catch(() => {});
    }
  };

  return (
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden text-slate-100 font-sans">
      {/* Studio Top Navbar */}
      <header className="h-16 px-4 sm:px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xs font-black text-slate-100 flex items-center gap-2">
              {projectTitle}
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                APIO SANDBOX
              </span>
            </h2>
            <span className="text-[10px] text-slate-400 hidden sm:inline font-mono">
              Compilación React 18 en Caliente (Babel Runtime)
            </span>
          </div>
        </div>

        {/* Responsive Switcher */}
        <div className="hidden sm:flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
          <button
            onClick={() => setDeviceView('desktop')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceView === 'desktop' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Escritorio"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceView('tablet')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceView === 'tablet' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tablet"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceView('mobile')}
            className={`p-1.5 rounded-lg transition-colors ${
              deviceView === 'mobile' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Celular"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadZip}
            isLoading={isExporting}
            leftIcon={<Download className="w-3.5 h-3.5 text-blue-400" />}
          >
            Descargar React (.ZIP)
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUpsellOpen(true)}
            leftIcon={<Zap className="w-3.5 h-3.5" />}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 font-extrabold shadow-lg shadow-blue-600/30"
          >
            Añadir CRM & Bot
          </Button>
        </div>
      </header>

      {/* Main Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Apio Copilot Chat, Code Editor, and README Tab */}
        <div className="w-84 md:w-96 border-r border-slate-800 bg-slate-900/60 flex flex-col flex-shrink-0">
          <div className="flex border-b border-slate-800 bg-slate-950 p-1.5 gap-1 text-xs">
            <button
              onClick={() => setActiveSideTab('chat')}
              className={`flex-1 py-1.5 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeSideTab === 'chat' ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>🤖 Apio Chat</span>
            </button>
            <button
              onClick={() => setActiveSideTab('code')}
              className={`flex-1 py-1.5 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeSideTab === 'code' ? 'bg-slate-800 text-white shadow-md border border-slate-700' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Código</span>
            </button>
            <button
              onClick={() => setActiveSideTab('readme')}
              className={`flex-1 py-1.5 font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeSideTab === 'readme' ? 'bg-slate-800 text-white shadow-md border border-slate-700' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>README</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeSideTab === 'chat' ? (
              <AIChatAssistant
                currentJsxCode={jsxCode}
                onUpdateJsxCode={handleUpdateFromApio}
              />
            ) : activeSideTab === 'code' ? (
              <CodeEditorTab
                jsxCode={jsxCode}
                onUpdateCode={(updated) => setJsxCode(updated)}
              />
            ) : (
              <div className="p-4 space-y-3 h-full flex flex-col text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <FileCode className="w-4 h-4 text-amber-400" /> Memoria del Proyecto
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setIsReadmeSaved(true);
                      setTimeout(() => setIsReadmeSaved(false), 2000);
                    }}
                    leftIcon={isReadmeSaved ? <Check className="w-3 h-3 text-emerald-400" /> : <Save className="w-3 h-3" />}
                  >
                    {isReadmeSaved ? '¡Guardado!' : 'Guardar'}
                  </Button>
                </div>
                <textarea
                  value={readmeDraft || `# 🚀 ${projectTitle}\n\nAplicación web interactiva desarrollada con el Agente Apio.`}
                  onChange={(e) => setReadmeDraft(e.target.value)}
                  rows={20}
                  className="flex-1 w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-xs text-slate-300 leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Virtual Live Sandbox Browser */}
        <div className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-6 flex justify-center items-start">
          <LiveSandboxPreview jsxCode={jsxCode} title={projectTitle} deviceView={deviceView} />
        </div>
      </div>

      <WebsiteUpsellModal
        isOpen={isUpsellOpen}
        onClose={() => setIsUpsellOpen(false)}
        onConfirmConnectCRM={() => {
          window.location.href = 'http://82.39.109.192:3001/dashboard';
        }}
        businessName={projectTitle}
      />
    </div>
  );
}
