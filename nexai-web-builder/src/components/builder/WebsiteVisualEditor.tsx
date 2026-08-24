'use client';

import React, { useState } from 'react';
import { GeneratedWebsite } from '@/types/builder';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Palette, Type, Phone, Image, Check, Plus, Trash2, MapPin, Store, Sparkles } from 'lucide-react';

interface WebsiteVisualEditorProps {
  website: GeneratedWebsite;
  onUpdateWebsite: (updated: GeneratedWebsite) => void;
}

export const WebsiteVisualEditor: React.FC<WebsiteVisualEditorProps> = ({
  website,
  onUpdateWebsite,
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'theme' | 'services' | 'map'>('content');

  const presetThemes = [
    { name: 'Naranja Fuego (Gastronomía)', primary: '#ea580c', secondary: '#9a3412' },
    { name: 'Azul Corporativo (Tech & B2B)', primary: '#3b82f6', secondary: '#1d4ed8' },
    { name: 'Verde Esmeralda (Salud & Dental)', primary: '#10b981', secondary: '#06b6d4' },
    { name: 'Dorado Cálido (Panadería & Café)', primary: '#d97706', secondary: '#78350f' },
    { name: 'Morado Real (Agencia & Belleza)', primary: '#7c3aed', secondary: '#4c1d95' },
    { name: 'Rojo Carmesí (Pizzería & Grill)', primary: '#dc2626', secondary: '#991b1b' },
  ];

  const handleAddService = () => {
    const newItem = {
      id: `srv_${Date.now().toString(36)}`,
      title: 'Nuevo Producto / Servicio',
      description: 'Descripción detallada de la oferta comercial.',
      price: 'S/ 35.00',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80',
    };
    onUpdateWebsite({ ...website, services: [...website.services, newItem] });
  };

  return (
    <Card className="h-full flex flex-col border-slate-800 bg-slate-900/90 shadow-2xl rounded-none md:rounded-2xl">
      <CardHeader className="py-3 px-4 border-b border-slate-800 bg-slate-950/60">
        <div className="flex flex-col gap-2.5 w-full">
          <CardTitle className="text-xs uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <span>Editor Visual en Vivo</span>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Instantáneo</span>
          </CardTitle>
          <div className="grid grid-cols-4 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs gap-1">
            <button
              onClick={() => setActiveTab('content')}
              className={`py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                activeTab === 'content' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Textos
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                activeTab === 'theme' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Colores
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                activeTab === 'services' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Catálogo
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                activeTab === 'map' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Ubicación
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-1 overflow-y-auto space-y-4 text-xs">
        {activeTab === 'content' && (
          <div className="space-y-3.5">
            <Input
              label="Nombre del Negocio"
              value={website.businessName}
              onChange={(e) => onUpdateWebsite({ ...website, businessName: e.target.value })}
            />
            <Input
              label="Insignia Destacada (Badge)"
              value={website.hero?.badge || ''}
              onChange={(e) => onUpdateWebsite({ ...website, hero: { ...website.hero, badge: e.target.value } })}
            />
            <Input
              label="Título Principal del Hero"
              value={website.hero?.title}
              onChange={(e) => onUpdateWebsite({ ...website, hero: { ...website.hero, title: e.target.value } })}
            />
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">Subtítulo Descriptivo</label>
              <textarea
                rows={3}
                value={website.hero?.subtitle}
                onChange={(e) => onUpdateWebsite({ ...website, hero: { ...website.hero, subtitle: e.target.value } })}
                className="w-full p-2.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Teléfono WhatsApp"
                value={website.phoneNumber}
                onChange={(e) => onUpdateWebsite({ ...website, phoneNumber: e.target.value })}
              />
              <Input
                label="Email de Contacto"
                value={website.email}
                onChange={(e) => onUpdateWebsite({ ...website, email: e.target.value })}
              />
            </div>
            <Input
              label="Texto del Botón (CTA)"
              value={website.hero?.ctaText || 'Hacer Pedido'}
              onChange={(e) => onUpdateWebsite({ ...website, hero: { ...website.hero, ctaText: e.target.value } })}
            />
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">Paletas de Color Rápidas (1 Clic)</label>
              <div className="grid grid-cols-1 gap-2">
                {presetThemes.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      onUpdateWebsite({
                        ...website,
                        theme: { ...website.theme, primaryColor: preset.primary, secondaryColor: preset.secondary },
                      })
                    }
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      website.theme?.primaryColor === preset.primary
                        ? 'bg-slate-800 border-blue-500 shadow-md'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-xs font-semibold text-slate-200">{preset.name}</span>
                    <div className="flex gap-1.5">
                      <span className="w-5 h-5 rounded-full border border-black/20" style={{ backgroundColor: preset.primary }} />
                      <span className="w-5 h-5 rounded-full border border-black/20" style={{ backgroundColor: preset.secondary }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-300">Color Primario Personalizado (Hex)</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={website.theme?.primaryColor || '#ea580c'}
                  onChange={(e) =>
                    onUpdateWebsite({
                      ...website,
                      theme: { ...website.theme, primaryColor: e.target.value },
                    })
                  }
                  className="w-12 h-10 rounded-xl cursor-pointer bg-slate-950 border border-slate-700"
                />
                <input
                  type="text"
                  value={website.theme?.primaryColor || '#ea580c'}
                  onChange={(e) =>
                    onUpdateWebsite({
                      ...website,
                      theme: { ...website.theme, primaryColor: e.target.value },
                    })
                  }
                  className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl font-mono text-xs text-slate-200 uppercase w-28"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">{(website.services?.length || 0)} Ítems en el Catálogo</span>
              <Button size="sm" onClick={handleAddService} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Agregar Ítem
              </Button>
            </div>

            {website.services.map((srv, idx) => (
              <div key={srv.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2.5 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-blue-400 font-mono">Ítem #{idx + 1}</span>
                  <button
                    onClick={() => {
                      const filtered = website.services.filter((s) => s.id !== srv.id);
                      onUpdateWebsite({ ...website, services: filtered });
                    }}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    title="Eliminar ítem"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <Input
                  label="Título / Nombre"
                  value={srv.title}
                  onChange={(e) => {
                    const updated = website.services.map((s) => (s.id === srv.id ? { ...s, title: e.target.value } : s));
                    onUpdateWebsite({ ...website, services: updated });
                  }}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Precio (en Soles S/)"
                    value={srv.price || ''}
                    onChange={(e) => {
                      const updated = website.services.map((s) => (s.id === srv.id ? { ...s, price: e.target.value } : s));
                      onUpdateWebsite({ ...website, services: updated });
                    }}
                  />
                  <Input
                    label="URL de Imagen"
                    value={srv.imageUrl || ''}
                    onChange={(e) => {
                      const updated = website.services.map((s) => (s.id === srv.id ? { ...s, imageUrl: e.target.value } : s));
                      onUpdateWebsite({ ...website, services: updated });
                    }}
                  />
                </div>
                <Input
                  label="Descripción"
                  value={srv.description || ''}
                  onChange={(e) => {
                    const updated = website.services.map((s) => (s.id === srv.id ? { ...s, description: e.target.value } : s));
                    onUpdateWebsite({ ...website, services: updated });
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'map' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <div>
                <span className="text-xs font-bold text-slate-200 block">Mapa de Ubicación Interactivo</span>
                <span className="text-[11px] text-slate-400">Incrustar Google Maps en el pie de página</span>
              </div>
              <input
                type="checkbox"
                checked={website.map?.enabled ?? true}
                onChange={(e) =>
                  onUpdateWebsite({
                    ...website,
                    map: { ...website.map, enabled: e.target.checked, address: website.map?.address || 'Av. Ramón Mujica 108', city: website.map?.city || 'Piura, Perú' },
                  })
                }
                className="w-5 h-5 rounded cursor-pointer accent-blue-600"
              />
            </div>

            <Input
              label="Dirección Comercial"
              value={website.address || 'Av. Ramón Mujica 108'}
              onChange={(e) => onUpdateWebsite({ ...website, address: e.target.value, map: { ...website.map, address: e.target.value, enabled: true, city: website.map?.city || 'Piura, Perú' } })}
            />
            <Input
              label="Ciudad y País"
              value={website.map?.city || 'Piura, Perú'}
              onChange={(e) => onUpdateWebsite({ ...website, map: { ...website.map, city: e.target.value, enabled: true, address: website.map?.address || website.address } })}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
