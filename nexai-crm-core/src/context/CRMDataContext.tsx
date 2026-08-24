'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Contact, PipelineDeal, ActivityLog, DashboardMetrics } from '@/types/crm';
import { PipelineStageDefinition, CustomFieldDefinition } from '@/types/industry';
import { useTenant } from './TenantContext';
import { StorageFactory } from '@/lib/solid/StorageFactory';
import { generateId } from '@/lib/utils';

interface CRMDataContextType {
  contacts: Contact[];
  deals: PipelineDeal[];
  activities: ActivityLog[];
  metrics: DashboardMetrics;
  stages: PipelineStageDefinition[];
  addContact: (contactData: Partial<Contact>) => Promise<Contact>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<Contact | null>;
  deleteContact: (id: string) => Promise<boolean>;
  addDeal: (dealData: Partial<PipelineDeal>) => Promise<PipelineDeal>;
  updateDeal: (id: string, updates: Partial<PipelineDeal>) => Promise<PipelineDeal | null>;
  deleteDeal: (id: string) => Promise<boolean>;
  moveDealToStage: (dealId: string, targetStageId: string) => Promise<void>;
  moveDeal: (dealId: string, targetStageId: string) => Promise<void>;
  updateStages: (stages: PipelineStageDefinition[]) => Promise<void>;
  addCustomField: (field: CustomFieldDefinition) => Promise<void>;
  deleteCustomField: (fieldId: string) => Promise<void>;
  logActivityEvent: (type: ActivityLog['type'], title: string, description: string, entityId?: string) => Promise<void>;
  isLoading: boolean;
}

const CRMDataContext = createContext<CRMDataContextType | undefined>(undefined);

export const CRMDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentTenant, updateTenant } = useTenant();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<PipelineDeal[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const storage = StorageFactory.getStorage();
  const stages = currentTenant.stages || [];

  useEffect(() => {
    async function loadData() {
      if (!currentTenant?.id) return;
      setIsLoading(true);
      try {
        const [loadedContacts, loadedDeals, loadedActivities] = await Promise.all([
          storage.getContacts(currentTenant.id),
          storage.getDeals(currentTenant.id),
          storage.getActivities(currentTenant.id),
        ]);
        setContacts(loadedContacts);
        setDeals(loadedDeals);
        setActivities(loadedActivities);
      } catch (err) {
        console.error('Error cargando datos del CRM:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [currentTenant?.id]);

  const logActivityEvent = async (
    type: ActivityLog['type'],
    title: string,
    description: string,
    entityId?: string
  ) => {
    const act: ActivityLog = {
      id: generateId('act'),
      tenantId: currentTenant.id,
      type,
      title,
      description,
      timestamp: new Date().toISOString(),
      entityId,
    };
    setActivities((prev) => [act, ...prev.slice(0, 50)]);
    await storage.logActivity(act);
  };

  const addContact = async (contactData: Partial<Contact>): Promise<Contact> => {
    const newContact: Contact = {
      id: generateId('cont'),
      tenantId: currentTenant.id,
      name: contactData.name || 'Nuevo Contacto',
      email: contactData.email || '',
      phone: contactData.phone || '',
      company: contactData.company || '',
      status: contactData.status || 'lead',
      tags: contactData.tags || [],
      customData: contactData.customData || {},
      notes: contactData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setContacts((prev) => [newContact, ...prev]);
    await storage.saveContact(newContact);
    await logActivityEvent('contact_created', 'Contacto Creado', `Se registró a ${newContact.name}`, newContact.id);
    return newContact;
  };

  const updateContact = async (id: string, updates: Partial<Contact>): Promise<Contact | null> => {
    const current = contacts.find((c) => c.id === id);
    if (!current) return null;

    const updated: Contact = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setContacts((prev) => prev.map((c) => (c.id === id ? updated : c)));
    await storage.saveContact(updated);
    return updated;
  };

  const deleteContact = async (id: string): Promise<boolean> => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    await storage.deleteContact(id, currentTenant.id);
    return true;
  };

  const addDeal = async (dealData: Partial<PipelineDeal>): Promise<PipelineDeal> => {
    const defaultStage = currentTenant.stages[0]?.id || 'stage_lead';
    const newDeal: PipelineDeal = {
      id: generateId('deal'),
      tenantId: currentTenant.id,
      title: dealData.title || 'Nueva Oportunidad',
      value: dealData.value || 0,
      stageId: dealData.stageId || defaultStage,
      contactId: dealData.contactId || '',
      contactName: dealData.contactName || 'Cliente Prospecto',
      contactPhone: dealData.contactPhone || '',
      priority: dealData.priority || 'medium',
      expectedCloseDate: dealData.expectedCloseDate || new Date(Date.now() + 86400000 * 7).toISOString(),
      customData: dealData.customData || {},
      notes: dealData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDeals((prev) => [newDeal, ...prev]);
    await storage.saveDeal(newDeal);
    await logActivityEvent('deal_created', 'Oportunidad Creada', `${newDeal.title} - Valor: ${newDeal.value}`, newDeal.id);
    return newDeal;
  };

  const updateDeal = async (id: string, updates: Partial<PipelineDeal>): Promise<PipelineDeal | null> => {
    const current = deals.find((d) => d.id === id);
    if (!current) return null;

    const updated: PipelineDeal = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    setDeals((prev) => prev.map((d) => (d.id === id ? updated : d)));
    await storage.saveDeal(updated);
    return updated;
  };

  const deleteDeal = async (id: string): Promise<boolean> => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
    await storage.deleteDeal(id, currentTenant.id);
    return true;
  };

  const moveDealToStage = async (dealId: string, targetStageId: string) => {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal || deal.stageId === targetStageId) return;

    const stageObj = currentTenant.stages.find((s) => s.id === targetStageId);
    const stageName = stageObj?.title || targetStageId;

    const updated = { ...deal, stageId: targetStageId, updatedAt: new Date().toISOString() };
    setDeals((prev) => prev.map((d) => (d.id === dealId ? updated : d)));
    await storage.saveDeal(updated);
    await logActivityEvent('deal_moved', 'Etapa Actualizada', `${deal.title} movido a "${stageName}"`, deal.id);
  };

  const updateStages = async (newStages: PipelineStageDefinition[]) => {
    await updateTenant({ stages: newStages });
  };

  const addCustomField = async (field: CustomFieldDefinition) => {
    const existing = currentTenant.customFields || [];
    await updateTenant({ customFields: [...existing, field] });
  };

  const deleteCustomField = async (fieldId: string) => {
    const existing = currentTenant.customFields || [];
    await updateTenant({ customFields: existing.filter((f) => f.id !== fieldId) });
  };

  const wonStage = currentTenant.stages[currentTenant.stages.length - 1]?.id;
  const wonDeals = deals.filter((d) => d.stageId === wonStage);
  const activeDeals = deals.filter((d) => d.stageId !== wonStage);
  const totalRevenue = deals.reduce((acc, d) => acc + (Number(d.value) || 0), 0);
  const conversionRate = deals.length > 0 ? Math.round((wonDeals.length / deals.length) * 100) : 0;
  const avgDealSize = deals.length > 0 ? Math.round(totalRevenue / deals.length) : 0;

  const metrics: DashboardMetrics = {
    totalRevenue,
    activeDealsCount: activeDeals.length,
    wonDealsCount: wonDeals.length,
    totalContactsCount: contacts.length,
    conversionRate,
    activeWhatsAppChats: 3,
    mrr: Math.round(totalRevenue * 0.12),
    avgDealSize,
  };

  return (
    <CRMDataContext.Provider
      value={{
        contacts,
        deals,
        activities,
        metrics,
        stages,
        addContact,
        updateContact,
        deleteContact,
        addDeal,
        updateDeal,
        deleteDeal,
        moveDealToStage,
        moveDeal: moveDealToStage,
        updateStages,
        addCustomField,
        deleteCustomField,
        logActivityEvent,
        isLoading,
      }}
    >
      {children}
    </CRMDataContext.Provider>
  );
};

export const useCRMData = () => {
  const context = useContext(CRMDataContext);
  if (!context) {
    throw new Error('useCRMData debe usarse dentro de CRMDataProvider');
  }
  return context;
};
