import { db } from './config';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';

export const firestoreService = {
  async getCollection<T>(collectionName: string, tenantId?: string): Promise<T[]> {
    try {
      let q = collection(db, collectionName);
      if (tenantId) {
        const queryWithTenant = query(q, where('tenantId', '==', tenantId));
        const snapshot = await getDocs(queryWithTenant);
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T));
      }
      const snapshot = await getDocs(q);
      return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as T));
    } catch {
      return [];
    }
  },

  async setDocument<T extends { id: string }>(collectionName: string, data: T): Promise<void> {
    try {
      const ref = doc(db, collectionName, data.id);
      await setDoc(ref, data, { merge: true });
    } catch (e) {
      console.warn(`Firestore setDocument falló en ${collectionName}:`, e);
    }
  },

  async removeDocument(collectionName: string, id: string): Promise<void> {
    try {
      const ref = doc(db, collectionName, id);
      await deleteDoc(ref);
    } catch (e) {
      console.warn(`Firestore removeDocument falló en ${collectionName}:`, e);
    }
  },
};
