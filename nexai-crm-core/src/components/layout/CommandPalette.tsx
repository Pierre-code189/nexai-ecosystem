'use client';
import React, { useState, useEffect } from 'react';
import { Search, Kanban, Users, Sliders, BarChart3, Settings, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!isOpen) return null;

  const actions = [
    { label: 'Ir al Tablero Kanban de Ventas', icon: Kanban, href: '/dashboard/pipeline' },
    { label: 'Ver Directorio de Contactos', icon: Users, href: '/dashboard/contacts' },
    { label: 'Abrir Estudio de Rubro & Auto-Discovery IA', icon: Sliders, href: '/dashboard/customization' },
    { label: 'Ver Analítica SaaS y Métricas', icon: BarChart3, href: '/dashboard/analytics' },
    { label: 'Configuración & Conexiones API', icon: Settings, href: '/dashboard/settings' },
  ];

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-3 border-b border-slate-800 flex items-center gap-2.5 bg-slate-950">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Escribe un comando o navega (ej. 'Kanban', 'Contactos')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs bg-transparent text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-2 max-h-72 overflow-y-auto space-y-1">
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                onClick={() => {
                  router.push(item.href);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-left text-slate-200 hover:bg-slate-800 transition-colors"
              >
                <Icon className="w-4 h-4 text-blue-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
        <div className="p-2 px-3 border-t border-slate-800 bg-slate-950 text-[10px] text-slate-500 flex justify-between">
          <span>Navegar con teclado</span>
          <span className="font-mono">ESC para cerrar</span>
        </div>
      </div>
    </div>
  );
};
