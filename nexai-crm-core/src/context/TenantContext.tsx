'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tenant, TenantTheme } from '@/types/tenant';
import { IndustryType, IndustryPreset } from '@/types/industry';
import { INDUSTRY_PRESETS } from '@/lib/solid/IndustryPresets';
import { StorageFactory } from '@/lib/solid/StorageFactory';
import { useAuth } from './AuthContext';

interface TenantContextType {
  currentTenant: Tenant;
  allTenants: Tenant[];
  currentPreset: IndustryPreset;
  switchTenant: (tenantId: string) => Promise<void>;
  updateTenant: (tenant: Partial<Tenant>) => Promise<void>;
  changeIndustry: (industry: IndustryType) => Promise<void>;
  updateTheme: (theme: Partial<TenantTheme>) => Promise<void>;
  createNewTenant: (name: string, industry: IndustryType) => Promise<Tenant>;
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const storage = StorageFactory.getStorage();

  const isSuperAdmin = user?.role === 'super_admin';
  const defaultTenantName = isSuperAdmin ? 'NexAI SaaS Platform' : (user?.displayName || 'Mi Empresa');
  const defaultSlug = isSuperAdmin ? 'nexai-platform' : (user?.displayName?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'mi-empresa');

  const defaultPreset = INDUSTRY_PRESETS.custom || INDUSTRY_PRESETS.retail;
  const initialDefaultTenant: Tenant = {
    id: user?.tenantId || 'tenant_default',
    name: defaultTenantName,
    slug: defaultSlug,
    industry: 'custom',
    plan: isSuperAdmin ? 'enterprise' : 'trial',
    currency: 'PEN',
    theme: {
      primaryColor: '#3b82f6',
      secondaryColor: '#1d4ed8',
      accentColor: '#60a5fa',
      darkModeDefault: true,
    },
    stages: defaultPreset.defaultStages,
    customFields: [...defaultPreset.contactFields, ...defaultPreset.dealFields],
    whatsappBotPrompt: 'Eres el Asistente Inteligente de Atención al Cliente y Ventas de NexCRM.',
    whatsappAutoReply: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [currentTenant, setCurrentTenant] = useState<Tenant>(initialDefaultTenant);
  const [allTenants, setAllTenants] = useState<Tenant[]>([initialDefaultTenant]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function init() {
      if (!user) return;
      try {
        const saved = await storage.getTenant(user.tenantId);
        if (saved && saved.name !== 'Inmobiliaria Costa Sol') {
          setCurrentTenant(saved);
          setAllTenants([saved]);
        } else {
          // Crear inquilino real para este usuario
          const newT: Tenant = {
            ...initialDefaultTenant,
            id: user.tenantId,
            name: defaultTenantName,
            slug: defaultSlug,
          };
          setCurrentTenant(newT);
          setAllTenants([newT]);
          await storage.saveTenant(newT);
        }
      } catch (err) {
        console.error('Error inicializando inquilino:', err);
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [user]);

  // Inyección de Variables CSS de Marca
  useEffect(() => {
    if (typeof document !== 'undefined' && currentTenant?.theme) {
      document.documentElement.style.setProperty('--color-primary', currentTenant.theme.primaryColor || '#3b82f6');
      document.documentElement.style.setProperty('--color-secondary', currentTenant.theme.secondaryColor || '#1d4ed8');
    }
  }, [currentTenant?.theme]);

  const switchTenant = async (tenantId: string) => {
    setIsLoading(true);
    const target = allTenants.find((t) => t.id === tenantId);
    if (target) {
      setCurrentTenant(target);
      await storage.saveTenant(target);
    }
    setIsLoading(false);
  };

  const updateTenant = async (partial: Partial<Tenant>) => {
    const updated: Tenant = {
      ...currentTenant,
      ...partial,
      updatedAt: new Date().toISOString(),
    };
    setCurrentTenant(updated);
    setAllTenants((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    await storage.saveTenant(updated);
  };

  const changeIndustry = async (industry: IndustryType) => {
    const preset = INDUSTRY_PRESETS[industry] || INDUSTRY_PRESETS.custom;
    const updated: Tenant = {
      ...currentTenant,
      industry,
      stages: preset.defaultStages,
      customFields: [...preset.contactFields, ...preset.dealFields],
      whatsappBotPrompt: preset.botSystemPromptTemplate,
      theme: {
        ...currentTenant.theme,
        primaryColor: preset.primaryColor,
        secondaryColor: preset.secondaryColor,
      },
      updatedAt: new Date().toISOString(),
    };
    setCurrentTenant(updated);
    setAllTenants((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    await storage.saveTenant(updated);
  };

  const updateTheme = async (themeUpdates: Partial<TenantTheme>) => {
    const updatedTheme = { ...currentTenant.theme, ...themeUpdates };
    await updateTenant({ theme: updatedTheme });
  };

  const createNewTenant = async (name: string, industry: IndustryType): Promise<Tenant> => {
    const preset = INDUSTRY_PRESETS[industry] || INDUSTRY_PRESETS.custom;
    const newId = `tenant_${name.toLowerCase().replace(/[^a-z0-9]/g, '-') || Date.now().toString(36)}`;
    const newTenant: Tenant = {
      id: newId,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      industry,
      plan: 'trial',
      currency: 'PEN',
      theme: {
        primaryColor: preset.primaryColor || '#3b82f6',
        secondaryColor: preset.secondaryColor || '#1d4ed8',
        accentColor: '#60a5fa',
        darkModeDefault: true,
      },
      stages: preset.defaultStages,
      customFields: [...preset.contactFields, ...preset.dealFields],
      whatsappBotPrompt: preset.botSystemPromptTemplate,
      whatsappAutoReply: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const nextList = [...allTenants, newTenant];
    setAllTenants(nextList);
    setCurrentTenant(newTenant);
    await storage.saveTenant(newTenant);
    return newTenant;
  };

  const currentPreset = INDUSTRY_PRESETS[currentTenant.industry] || INDUSTRY_PRESETS.custom;

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        allTenants,
        currentPreset,
        switchTenant,
        updateTenant,
        changeIndustry,
        updateTheme,
        createNewTenant,
        isLoading,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) throw new Error('useTenant debe usarse dentro de TenantProvider');
  return context;
};
