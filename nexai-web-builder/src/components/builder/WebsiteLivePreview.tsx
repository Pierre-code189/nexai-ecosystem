'use client';

import React, { useState, useRef } from 'react';
import { GeneratedWebsite, WebsiteCartItem } from '@/types/builder';
import {
  MessageSquare,
  MapPin,
  Star,
  Send,
  CheckCircle2,
  Upload,
  Camera,
  Edit3,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Sun,
  Moon,
  X,
  CreditCard,
  Phone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface WebsiteLivePreviewProps {
  website: GeneratedWebsite;
  deviceView?: 'desktop' | 'tablet' | 'mobile';
  onUpdateWebsite?: (updated: GeneratedWebsite) => void;
  isReadOnly?: boolean;
}

export const WebsiteLivePreview: React.FC<WebsiteLivePreviewProps> = ({
  website,
  deviceView = 'desktop',
  onUpdateWebsite,
  isReadOnly = false,
}) => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cart, setCart] = useState<WebsiteCartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const primaryColor = website.theme?.primaryColor || '#ea580c';
  const secondaryColor = website.theme?.secondaryColor || '#9a3412';

  // Carrito de compras reactivo
  const addToCart = (item: { id: string; title: string; price?: string }) => {
    const rawPrice = item.price ? parseFloat(item.price.replace(/[^0-9.]/g, '')) || 35 : 35;
    setCart((prev) => {
      const existing = prev.find((c) => c.serviceId === item.id);
      if (existing) {
        return prev.map((c) => (c.serviceId === item.id ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { serviceId: item.id, title: item.title, price: item.price || 'S/ 35.00', numericPrice: rawPrice, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQty = (serviceId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => (c.serviceId === serviceId ? { ...c, quantity: Math.max(0, c.quantity + delta) } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.numericPrice * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      const crmApiUrl = process.env.NEXT_PUBLIC_CRM_API_URL || 'http://127.0.0.1:3001/api/leads';
      await fetch(crmApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId: website.tenantId || 'tenant_default',
          title: `Lead Web: ${formData.name}`,
          value: cartTotal > 0 ? cartTotal : 1500,
          contactName: formData.name,
          contactPhone: formData.phone,
          contactEmail: formData.email,
          notes: `Consulta recibida desde la web de ${website.businessName}: ${formData.message}`,
        }),
      });
    } catch {
      // Manejo seguro de fallback
    }

    setIsSubmitted(true);
    setFormData({ name: '', phone: '', email: '', message: '' });
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateWebsite) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        onUpdateWebsite({
          ...website,
          hero: { ...website.hero, bannerImageUrl: dataUrl },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductUpload = (serviceId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateWebsite) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const updated = website.services.map((s) => (s.id === serviceId ? { ...s, imageUrl: dataUrl } : s));
        onUpdateWebsite({ ...website, services: updated });
      };
      reader.readAsDataURL(file);
    }
  };

  const containerStyles = {
    desktop: 'w-full max-w-6xl mx-auto shadow-2xl rounded-3xl overflow-hidden border border-slate-800',
    tablet: 'max-w-2xl mx-auto shadow-2xl border border-slate-700 rounded-3xl overflow-hidden',
    mobile: 'max-w-sm mx-auto shadow-2xl border border-slate-700 rounded-3xl overflow-hidden',
  };

  const cleanPhone = (website.phoneNumber || '+51 928 100 975').replace(/[^0-9]/g, '');

  return (
    <div
      className={`transition-all duration-300 ${containerStyles[deviceView]} ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      } font-sans relative`}
    >
      {/* Live Editor Notification Banner (Only if interactive) */}
      {!isReadOnly && (
        <div className="sticky top-2 z-40 mx-auto w-fit px-4 py-1 rounded-full bg-blue-600/90 text-white text-[11px] font-bold shadow-xl flex items-center gap-2 backdrop-blur-md border border-blue-400/30">
          <Edit3 className="w-3.5 h-3.5" />
          <span>Editor en Vivo: Haz clic sobre textos para editar o sobre fotos para reemplazarlas</span>
        </div>
      )}

      {/* Header / Navbar */}
      <nav
        className={`px-4 sm:px-8 py-4 border-b ${
          isDarkMode ? 'border-slate-800/80 bg-slate-950/90' : 'border-slate-200 bg-white/90'
        } backdrop-blur-md sticky top-0 z-30 flex items-center justify-between`}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base shadow-md shadow-black/20"
            style={{ backgroundColor: primaryColor }}
          >
            {(website.businessName || 'N').substring(0, 1).toUpperCase()}
          </div>
          <span
            contentEditable={!isReadOnly}
            suppressContentEditableWarning
            onBlur={(e) =>
              !isReadOnly &&
              onUpdateWebsite &&
              onUpdateWebsite({ ...website, businessName: e.currentTarget.textContent || website.businessName })
            }
            className="font-black text-base sm:text-lg tracking-tight hover:bg-blue-500/10 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {website.businessName}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Light Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl border border-slate-700/50 hover:bg-slate-800/40 text-slate-400 transition-colors"
            title="Alternar Modo Oscuro/Claro"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white transition-colors shadow-sm"
            title="Ver Carrito de Compras"
          >
            <ShoppingCart className="w-4 h-4" />
            {cart.length > 0 && (
              <span
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-white text-[10px] font-black flex items-center justify-center shadow-lg"
                style={{ backgroundColor: primaryColor }}
              >
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </button>

          {/* Direct WhatsApp CTA */}
          <a
            href={`https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(website.businessName)},%20deseo%20m%C3%A1s%20informaci%C3%B3n.`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md hover:opacity-90 transition-all"
            style={{ backgroundColor: primaryColor }}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-4 sm:px-8 py-12 sm:py-16 text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-900/90 border border-slate-800 text-slate-300 shadow-sm">
          <span
            contentEditable={!isReadOnly}
            suppressContentEditableWarning
            onBlur={(e) =>
              !isReadOnly &&
              onUpdateWebsite &&
              onUpdateWebsite({ ...website, hero: { ...website.hero, badge: e.currentTarget.textContent || '' } })
            }
            className="focus:outline-none"
          >
            {website.hero?.badge || '✨ Calidad Garantizada'}
          </span>
        </div>

        <h1
          contentEditable={!isReadOnly}
          suppressContentEditableWarning
          onBlur={(e) =>
            !isReadOnly &&
            onUpdateWebsite &&
            onUpdateWebsite({ ...website, hero: { ...website.hero, title: e.currentTarget.textContent || website.hero?.title } })
          }
          className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15] focus:outline-none"
        >
          {website.hero?.title}
        </h1>

        <p
          contentEditable={!isReadOnly}
          suppressContentEditableWarning
          onBlur={(e) =>
            !isReadOnly &&
            onUpdateWebsite &&
            onUpdateWebsite({ ...website, hero: { ...website.hero, subtitle: e.currentTarget.textContent || website.hero?.subtitle } })
          }
          className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed focus:outline-none"
        >
          {website.hero?.subtitle}
        </p>

        <div className="flex flex-wrap justify-center gap-3.5 pt-2">
          <a
            href="#contacto"
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white shadow-xl hover:opacity-90 transition-all flex items-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            <span>{website.hero?.ctaText || 'Hacer Pedido'}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#catalogo"
            className="px-6 py-3 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 border border-slate-700/80 text-slate-200 hover:bg-slate-800 transition-colors"
          >
            Ver Productos / Carta
          </a>
        </div>

        {/* Hero Banner with Image Uploader */}
        <div className="pt-6 max-w-3xl mx-auto relative group">
          <img
            src={
              website.hero?.bannerImageUrl ||
              'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80'
            }
            alt="Banner Principal"
            className="w-full h-60 sm:h-84 object-cover rounded-3xl border border-slate-800 shadow-2xl"
          />
          {!isReadOnly && (
            <button
              onClick={() => bannerInputRef.current?.click()}
              className="absolute bottom-4 right-4 px-3.5 py-2 rounded-xl bg-slate-950/90 hover:bg-slate-900 text-white text-xs font-bold shadow-xl flex items-center gap-1.5 border border-slate-700 transition-all backdrop-blur-md"
            >
              <Camera className="w-4 h-4 text-blue-400" />
              <span>Cambiar Foto Banner</span>
            </button>
          )}
          <input ref={bannerInputRef} type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
        </div>
      </section>

      {/* Catalog & Services Grid */}
      <section id="catalogo" className="px-4 sm:px-8 py-12 sm:py-16 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black">Catálogo & Opciones Destacadas</h2>
            <p className="text-xs sm:text-sm text-slate-400">Selecciona tus productos favoritos y agrégalos al carrito</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {website.services.map((item) => (
              <div
                key={item.id}
                className="bg-slate-900/90 border border-slate-800/90 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between relative group hover:border-slate-700 transition-all"
              >
                {item.imageUrl && (
                  <div className="relative h-48 w-full bg-slate-950">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    {!isReadOnly && (
                      <label className="absolute bottom-2 right-2 px-2.5 py-1.5 bg-slate-950/90 text-white rounded-xl text-[10px] font-bold cursor-pointer flex items-center gap-1 shadow-lg border border-slate-700 backdrop-blur-md">
                        <Upload className="w-3 h-3 text-blue-400" /> Cambiar Foto
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleProductUpload(item.id, e)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                )}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      contentEditable={!isReadOnly}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        if (isReadOnly || !onUpdateWebsite) return;
                        const updated = website.services.map((s) =>
                          s.id === item.id ? { ...s, title: e.currentTarget.textContent || s.title } : s
                        );
                        onUpdateWebsite({ ...website, services: updated });
                      }}
                      className="text-sm font-bold text-slate-100 focus:outline-none hover:bg-blue-500/10 p-0.5 rounded"
                    >
                      {item.title}
                    </h3>
                    <p
                      contentEditable={!isReadOnly}
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        if (isReadOnly || !onUpdateWebsite) return;
                        const updated = website.services.map((s) =>
                          s.id === item.id ? { ...s, description: e.currentTarget.textContent || s.description } : s
                        );
                        onUpdateWebsite({ ...website, services: updated });
                      }}
                      className="text-xs text-slate-400 mt-1 leading-relaxed focus:outline-none hover:bg-blue-500/10 p-0.5 rounded"
                    >
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block">Precio</span>
                      <span className="text-sm font-black text-emerald-400 font-mono">{item.price || 'S/ 35.00'}</span>
                    </div>
                    <button
                      onClick={() => addToCart(item)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-md hover:opacity-90 transition-all active:scale-95"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Agregar</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location / Google Maps */}
      {website.map?.enabled && (
        <section className="px-4 sm:px-8 py-12 max-w-4xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm font-bold text-blue-400">
            <MapPin className="w-4 h-4" />
            <span>Nuestra Ubicación: {website.map?.address || 'Av. Ramón Mujica 108'}, {website.map?.city || 'Piura, Perú'}</span>
          </div>
          <div className="w-full h-64 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
            <iframe
              title="Mapa de Ubicacion"
              src="https://maps.google.com/maps?q=Piura,Peru&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </section>
      )}

      {/* Contact Form Connected to CRM */}
      <section id="contacto" className="px-4 sm:px-8 py-12 sm:py-16 bg-slate-900/70 border-t border-slate-800/80">
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black">Contáctanos / Haz tu Pedido</h2>
            <p className="text-xs text-slate-400">Atención directa y sincronización en vivo con nuestro CRM</p>
          </div>

          {isSubmitted ? (
            <div className="p-8 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl text-center space-y-2 animate-in fade-in">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-emerald-300">¡Mensaje Registrado con Éxito!</h3>
              <p className="text-xs text-slate-400">Tu solicitud ya ingresó a nuestro embudo comercial.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-2xl">
              <input
                type="text"
                placeholder="Tu Nombre Completo..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="WhatsApp / Teléfono..."
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <input
                  type="email"
                  placeholder="Correo Electrónico..."
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <textarea
                rows={3}
                placeholder="Escribe los detalles de tu consulta o pedido..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="w-full px-4 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-black text-xs text-white shadow-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                style={{ backgroundColor: primaryColor }}
              >
                <Send className="w-4 h-4" />
                <span>Enviar Mensaje / Solicitar Cotización</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Floating Shopping Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 h-full p-6 flex flex-col justify-between border-l border-slate-800 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-sm text-white">Carrito de Compras</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-4 overflow-y-auto space-y-3">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-xs">Tu carrito de compras está vacío.</div>
              ) : (
                cart.map((item) => (
                  <div key={item.serviceId} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-100">{item.title}</h4>
                      <span className="text-[11px] text-emerald-400 font-mono font-bold">S/ {(item.numericPrice * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-900 px-2 py-1 rounded-xl border border-slate-700">
                      <button onClick={() => updateCartQty(item.serviceId, -1)} className="text-slate-400 hover:text-white">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-slate-100">{item.quantity}</span>
                      <button onClick={() => updateCartQty(item.serviceId, 1)} className="text-slate-400 hover:text-white">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex justify-between items-center text-sm font-bold text-white">
                  <span>Total a Pagar:</span>
                  <span className="text-emerald-400 font-mono text-lg font-black">S/ {cartTotal.toFixed(2)}</span>
                </div>
                <a
                  href={`https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(website.businessName)},%20deseo%20confirmar%20mi%20pedido%20de:%20${encodeURIComponent(
                    cart.map((c) => `${c.quantity}x ${c.title}`).join(', ')
                  )}%20Total:%20S/${cartTotal.toFixed(2)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 rounded-2xl font-extrabold text-xs text-white flex items-center justify-center gap-2 shadow-xl hover:opacity-95 transition-all"
                  style={{ backgroundColor: primaryColor }}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Pagar con Yape / Plin por WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
