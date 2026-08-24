'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Wand2,
  Globe,
  Download,
  Code2,
  CheckCircle2,
  Layers,
  MessageSquare,
  Zap,
  Shield,
  Smartphone,
  ChevronRight,
  Star,
  Check,
  Building2,
  Store,
  Stethoscope,
  Utensils,
  Cpu,
  BarChart3,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomeSaaS() {
  const router = useRouter();
  const [naturalIdea, setNaturalIdea] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

  const industryPresets = [
    {
      id: 'gastronomia',
      icon: '🍕',
      name: 'Gastronomía & Dark Kitchen',
      prompt: "Tengo una pizzería artesanal en Piura llamada Kira's Pizza. Masa madre de 48h, combos familiares, bebidas y delivery express con pedidos directos a WhatsApp y pagos por Yape.",
    },
    {
      id: 'panaderia',
      icon: '🥖',
      name: 'Panadería & Pastelería',
      prompt: 'Panadería y Pastelería Don Pan con panes de masa madre recién horneados, croissants franceses, tortas artesanales y bocaditos con catálogo interactivo y pedidos.',
    },
    {
      id: 'salud',
      icon: '🏥',
      name: 'Salud & Odontología',
      prompt: 'Clínica Dental Sonrisas en Piura especializada en blanqueamiento dental láser, ortodoncia invisible, brackets y urgencias 24/7 con agendamiento de citas directo.',
    },
    {
      id: 'barberia',
      icon: '✂️',
      name: 'Barbería & Estética',
      prompt: 'Barbería VIP Imperial con cortes de tendencia, perfilado de barba, tratamientos capilares y reservas online con atención personalizada.',
    },
    {
      id: 'inmobiliaria',
      icon: '🏢',
      name: 'Inmobiliaria & Bienes Raíces',
      prompt: 'Inmobiliaria Costa Sol con catálogo de casas, departamentos de estreno, terrenos residenciales y asesoría legal para compradores e inversionistas.',
    },
    {
      id: 'comercio',
      icon: '👗',
      name: 'Boutique & E-commerce',
      prompt: 'Tienda de moda urbana y calzado con catálogo de prendas exclusivas, carrito de compras, cálculo de envíos a todo el Perú y checkout por WhatsApp.',
    },
  ];

  const handleStartBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!naturalIdea.trim()) return;

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('builder_prompt', naturalIdea);
      sessionStorage.setItem('builder_bname', naturalIdea.split(' ')[0] || 'Mi Negocio');
    }
    router.push('/builder');
  };

  const handleSelectPreset = (presetPrompt: string) => {
    setNaturalIdea(presetPrompt);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600 selection:text-white flex flex-col justify-between overflow-x-hidden font-sans">
      {/* Background Lighting Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-600/10 via-indigo-600/5 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-32 -left-48 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 -right-48 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Navbar with Glassmorphism */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/25 ring-1 ring-white/20">
              N
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-white flex items-center gap-2">
                NexAI <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 font-bold">BUILDER v4.0</span>
              </span>
              <p className="text-[11px] text-slate-400 font-medium">Generador Web React + CRM Universal Multi-Tenant</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#demo" className="hover:text-white transition-colors">Demostración</a>
            <a href="#features" className="hover:text-white transition-colors">Módulos</a>
            <a href="#pricing" className="hover:text-white transition-colors">Planes & Precios</a>
            <a href="#faq" className="hover:text-white transition-colors">Preguntas Frecuentes</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="http://82.39.109.192:3001"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all"
            >
              <span>Acceder al CRM</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <Link
              href="/builder"
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-extrabold rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 transform hover:scale-[1.02]"
            >
              <Wand2 className="w-4 h-4" />
              <span>Crear Sitio Web Gratis</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 text-center space-y-10 flex-1 relative z-10">
        {/* Top Innovation Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-cyan-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold shadow-md shadow-blue-500/5">
          <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
          <span>Inteligencia Artificial Local + Exportación en React 18 (.ZIP)</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Title and Subtitle */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-100 tracking-tight leading-[1.15]">
            Transforma cualquier idea en un{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
              Sitio Web Comercial en React
            </span>{' '}
            en segundos
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Escribe en lenguaje natural lo que hace tu negocio. La IA estructurará el catálogo de productos con precios en Soles (<code className="text-emerald-400 font-bold font-mono">S/</code>), carrito interactivo, editor visual en vivo y conexión directa a WhatsApp y CRM.
          </p>
        </div>

        {/* High-Converting Natural Prompt Box */}
        <div className="max-w-3xl mx-auto p-5 sm:p-7 bg-slate-900/90 border border-slate-700/80 rounded-3xl shadow-2xl space-y-4 backdrop-blur-xl text-left relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span className="flex items-center gap-2 text-blue-400">
              <Wand2 className="w-4 h-4" /> Cuéntale a la IA sobre tu negocio:
            </span>
            <span className="text-[10px] text-slate-500 font-mono">React 18 + Tailwind CSS</span>
          </div>

          <form onSubmit={handleStartBuilding} className="space-y-3.5">
            <textarea
              rows={4}
              placeholder="Ejemplo: 'Tengo una pizzería artesanal en Piura llamada Kira's Pizza con masa madre de 48 horas, combos familiares, bebidas y delivery por WhatsApp. Quiero una web moderna con colores cálidos y botón de pedido...'"
              value={naturalIdea}
              onChange={(e) => setNaturalIdea(e.target.value)}
              required
              className="w-full p-4 text-sm bg-slate-950/90 border border-slate-700 rounded-2xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed transition-all shadow-inner"
            />

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:opacity-95 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99]"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Sintetizar Idea & Generar Sitio Web en Vivo</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Quick Industry Pills */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <span className="text-slate-400 text-[11px] font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Rubros populares con catálogo listo:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {industryPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.prompt)}
                  className="p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all text-xs flex items-center gap-2 group/btn"
                >
                  <span className="text-base group-hover/btn:scale-110 transition-transform">{preset.icon}</span>
                  <span className="text-slate-300 font-semibold truncate text-[11px]">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Grid: 3 Pillars */}
        <section id="features" className="pt-16 max-w-5xl mx-auto text-left space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest font-mono">Arquitectura Integral</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Todo lo que necesitas para vender en línea</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Generación Real en React</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                No son páginas estáticas; la IA genera componentes modulares en React 18, Tailwind CSS, carrito interactivo y descarga de código en <strong>.ZIP</strong>.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Bot de WhatsApp IA 24/7</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Atención automática de pedidos, validación de pagos Yape/Plin por OCR y respuestas de ventas inteligentes con IA local en tu VPS.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">CRM Multi-Tenant en Vivo</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cada formulario web ingresa automáticamente a tu embudo Kanban con Lead Scoring inteligente y persistencia en Firebase Firestore.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Matrix */}
        <section id="pricing" className="pt-16 max-w-5xl mx-auto text-left space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-widest font-mono">Planes Comerciales</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Comienza gratis o escala tu negocio</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase">Starter Web</span>
                <div className="text-3xl font-black text-white">S/ 0.00 <span className="text-xs text-slate-500 font-normal">/ gratis</span></div>
                <p className="text-xs text-slate-400">Ideal para probar el generador y descargar código.</p>
                <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Generador Web con IA</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Descarga de código en .ZIP</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Vista responsiva en vivo</li>
                </ul>
              </div>
              <Link href="/builder" className="w-full py-2.5 text-center text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all">
                Probar Generador
              </Link>
            </div>

            {/* Pro Negocios (Destacado) */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-blue-950/60 to-slate-900 border-2 border-blue-500 space-y-5 flex flex-col justify-between relative shadow-2xl shadow-blue-500/10">
              <span className="absolute -top-3 right-6 text-[10px] font-black uppercase px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow">
                Más Popular
              </span>
              <div className="space-y-3">
                <span className="text-xs font-bold text-blue-400 uppercase">Web + CRM Pro</span>
                <div className="text-3xl font-black text-white">S/ 49.90 <span className="text-xs text-slate-400 font-normal">/ mes</span></div>
                <p className="text-xs text-slate-300">Tu negocio 100% automatizado con WhatsApp.</p>
                <ul className="space-y-2 text-xs text-slate-200 pt-3 border-t border-slate-800">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Sitio web alojado con dominio</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Bot de WhatsApp IA 24/7 ilimitado</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Embudo Kanban y captura de leads</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Validación de pagos Yape / Plin</li>
                </ul>
              </div>
              <Link href="/builder" className="w-full py-3 text-center text-xs font-extrabold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all">
                Iniciar 14 Días Gratis
              </Link>
            </div>

            {/* Enterprise */}
            <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase">Marca Blanca SaaS</span>
                <div className="text-3xl font-black text-white">S/ 129.90 <span className="text-xs text-slate-500 font-normal">/ mes</span></div>
                <p className="text-xs text-slate-400">Para agencias que revenden el software a clientes.</p>
                <ul className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Multi-Empresas (Tenants) ilimitadas</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Personalización de Logo y Colores</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Panel de Super Administrador</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Despliegue en VPS propio</li>
                </ul>
              </div>
              <a href="http://82.39.109.192:3001" target="_blank" rel="noreferrer" className="w-full py-2.5 text-center text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all">
                Contactar Ventas
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-8 text-center text-xs text-slate-500 space-y-2">
        <div className="flex justify-center gap-6 text-slate-400 text-xs font-medium pb-2">
          <Link href="/builder" className="hover:text-white">Web Builder</Link>
          <a href="http://82.39.109.192:3001" target="_blank" rel="noreferrer" className="hover:text-white">CRM Universal</a>
          <a href="http://82.39.109.192:3001/dashboard/whatsapp" target="_blank" rel="noreferrer" className="hover:text-white">WhatsApp Bot Hub</a>
        </div>
        <p>© {new Date().getFullYear()} NexAI Platform — Diseñado y Desarrollado por Gian Pierre Sernaqué Wong (Pierre). Piura, Perú.</p>
      </footer>
    </div>
  );
}
