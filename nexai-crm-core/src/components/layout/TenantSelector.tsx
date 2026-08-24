'use client';

import React, { useState } from 'react';
import { useTenant } from '@/context/TenantContext';
import { useAuth } from '@/context/AuthContext';
import { ChevronDown, Plus, Building2, Check, X } from 'lucide-react';
import { IndustryType } from '@/types/industry';

export const TenantSelector: React.FC = () => {
  const { currentTenant, allTenants, switchTenant, createNewTenant } = useTenant();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantIndustry, setNewTenantIndustry] = useState<IndustryType>('retail');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName.trim()) return;
    setIsSubmitting(true);
    try {
      await createNewTenant(newTenantName.trim(), newTenantIndustry);
      setNewTenantName('');
      setIsCreateModalOpen(false);
      setIsOpen(false);
    } catch (err) {
      console.error('Error creando empresa:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 text-xs font-semibold transition-all max-w-[200px]"
      >
        <Building2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <span className="truncate">{currentTenant.name || 'Mi Empresa'}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-auto" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-2 text-xs animate-in fade-in zoom-in-95">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Mis Empresas ({allTenants.length})
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1 py-1">
            {allTenants.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  switchTenant(t.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors ${
                  t.id === currentTenant.id
                    ? 'bg-blue-600/20 text-blue-300 font-bold border border-blue-500/30'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="truncate">{t.name}</span>
                {t.id === currentTenant.id && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsCreateModalOpen(true);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-emerald-400 hover:bg-emerald-500/10 font-bold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Crear Nueva Empresa</span>
            </button>
          </div>
        </div>
      )}

      {/* Centered Modal for Creating Tenant */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-400" />
                <h3 className="font-extrabold text-base text-white">Registrar Nueva Empresa</h3>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Nombre de la Empresa / Negocio</label>
                <input
                  type="text"
                  placeholder="Ej. Kira's Pizza / Clínica Dental Sonrisas..."
                  value={newTenantName}
                  onChange={(e) => setNewTenantName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-300">Rubro o Giro Comercial</label>
                <select
                  value={newTenantIndustry}
                  onChange={(e) => setNewTenantIndustry(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                >
                  <option value="retail">Gastronomía, Pizzerías & Dark Kitchen</option>
                  <option value="medical">Salud, Odontología & Clínicas</option>
                  <option value="automotive">Automotriz & Talleres Mecánicos</option>
                  <option value="real_estate">Inmobiliaria & Bienes Raíces</option>
                  <option value="custom">Servicios Generales & Comercio</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-600/30"
                >
                  {isSubmitting ? 'Creando...' : 'Crear Empresa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
