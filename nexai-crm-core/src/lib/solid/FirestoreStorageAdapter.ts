import { IStorageAdapter } from '@/types/solid';
import { Tenant } from '@/types/tenant';
import { Contact, PipelineDeal, ActivityLog } from '@/types/crm';
import { ChatSession, WhatsAppMessage } from '@/types/whatsapp';
import { LocalStorageAdapter } from './LocalStorageAdapter';
import { db } from '@/lib/firebase/config';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  limit,
} from 'firebase/firestore';

/**
 * Adaptador de Persistencia Real en Firebase Firestore.
 * Sigue el Principio de Sustitución de Liskov (LSP).
 * Si Firestore no está disponible o falla por permisos/red,
 * delega automáticamente en LocalStorageAdapter sin interrumpir la UI.
 */
export class FirestoreStorageAdapter implements IStorageAdapter {
  private fallbackAdapter = new LocalStorageAdapter();
  private isFirebaseConfigured: boolean;

  constructor() {
    this.isFirebaseConfigured = Boolean(
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_ENABLE_MOCK_STORAGE !== 'true'
    );
  }

  async getTenant(id: string): Promise<Tenant | null> {
    if (!this.isFirebaseConfigured || !db) return this.fallbackAdapter.getTenant(id);
    try {
      const docRef = doc(db, 'tenants', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data() as Tenant;
        this.fallbackAdapter.saveTenant(data);
        return data;
      }
      return this.fallbackAdapter.getTenant(id);
    } catch (e) {
      console.warn('Firestore getTenant fallback:', e);
      return this.fallbackAdapter.getTenant(id);
    }
  }

  async saveTenant(tenant: Tenant): Promise<Tenant> {
    await this.fallbackAdapter.saveTenant(tenant);
    if (this.isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'tenants', tenant.id);
        await setDoc(docRef, tenant, { merge: true });
      } catch (e) {
        console.warn('Firestore saveTenant fallback:', e);
      }
    }
    return tenant;
  }

  async getContacts(tenantId: string): Promise<Contact[]> {
    if (!this.isFirebaseConfigured || !db) return this.fallbackAdapter.getContacts(tenantId);
    try {
      const q = query(collection(db, 'contacts'), where('tenantId', '==', tenantId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Contact));
        return list;
      }
      return this.fallbackAdapter.getContacts(tenantId);
    } catch (e) {
      console.warn('Firestore getContacts fallback:', e);
      return this.fallbackAdapter.getContacts(tenantId);
    }
  }

  async saveContact(contact: Contact): Promise<Contact> {
    await this.fallbackAdapter.saveContact(contact);
    if (this.isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'contacts', contact.id);
        await setDoc(docRef, contact, { merge: true });
      } catch (e) {
        console.warn('Firestore saveContact fallback:', e);
      }
    }
    return contact;
  }

  async deleteContact(id: string, tenantId: string): Promise<boolean> {
    await this.fallbackAdapter.deleteContact(id, tenantId);
    if (this.isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'contacts', id);
        await deleteDoc(docRef);
      } catch (e) {
        console.warn('Firestore deleteContact fallback:', e);
      }
    }
    return true;
  }

  async getDeals(tenantId: string): Promise<PipelineDeal[]> {
    if (!this.isFirebaseConfigured || !db) return this.fallbackAdapter.getDeals(tenantId);
    try {
      const q = query(collection(db, 'deals'), where('tenantId', '==', tenantId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as PipelineDeal));
        return list;
      }
      return this.fallbackAdapter.getDeals(tenantId);
    } catch (e) {
      console.warn('Firestore getDeals fallback:', e);
      return this.fallbackAdapter.getDeals(tenantId);
    }
  }

  async saveDeal(deal: PipelineDeal): Promise<PipelineDeal> {
    await this.fallbackAdapter.saveDeal(deal);
    if (this.isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'deals', deal.id);
        await setDoc(docRef, deal, { merge: true });
      } catch (e) {
        console.warn('Firestore saveDeal fallback:', e);
      }
    }
    return deal;
  }

  async deleteDeal(id: string, tenantId: string): Promise<boolean> {
    await this.fallbackAdapter.deleteDeal(id, tenantId);
    if (this.isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'deals', id);
        await deleteDoc(docRef);
      } catch (e) {
        console.warn('Firestore deleteDeal fallback:', e);
      }
    }
    return true;
  }

  async getActivities(tenantId: string): Promise<ActivityLog[]> {
    if (!this.isFirebaseConfigured || !db) return this.fallbackAdapter.getActivities(tenantId);
    try {
      const q = query(collection(db, 'activities'), where('tenantId', '==', tenantId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ActivityLog));
        return list;
      }
      return this.fallbackAdapter.getActivities(tenantId);
    } catch (e) {
      console.warn('Firestore getActivities fallback:', e);
      return this.fallbackAdapter.getActivities(tenantId);
    }
  }

  async logActivity(activity: ActivityLog): Promise<void> {
    await this.fallbackAdapter.logActivity(activity);
    if (this.isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'activities', activity.id);
        await setDoc(docRef, activity, { merge: true });
      } catch (e) {
        console.warn('Firestore logActivity fallback:', e);
      }
    }
  }

  async getChatSessions(tenantId: string): Promise<ChatSession[]> {
    if (!this.isFirebaseConfigured || !db) return this.fallbackAdapter.getChatSessions(tenantId);
    try {
      const q = query(collection(db, 'chat_sessions'), where('tenantId', '==', tenantId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChatSession));
      }
      return this.fallbackAdapter.getChatSessions(tenantId);
    } catch (e) {
      console.warn('Firestore getChatSessions fallback:', e);
      return this.fallbackAdapter.getChatSessions(tenantId);
    }
  }

  async getChatMessages(chatId: string, tenantId: string): Promise<WhatsAppMessage[]> {
    if (!this.isFirebaseConfigured || !db) return this.fallbackAdapter.getChatMessages(chatId, tenantId);
    try {
      const q = query(collection(db, 'chat_messages'), where('chatId', '==', chatId));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as WhatsAppMessage));
      }
      return this.fallbackAdapter.getChatMessages(chatId, tenantId);
    } catch (e) {
      console.warn('Firestore getChatMessages fallback:', e);
      return this.fallbackAdapter.getChatMessages(chatId, tenantId);
    }
  }

  async saveChatMessage(message: WhatsAppMessage): Promise<WhatsAppMessage> {
    await this.fallbackAdapter.saveChatMessage(message);
    if (this.isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'chat_messages', message.id);
        await setDoc(docRef, message, { merge: true });
      } catch (e) {
        console.warn('Firestore saveChatMessage fallback:', e);
      }
    }
    return message;
  }
}
