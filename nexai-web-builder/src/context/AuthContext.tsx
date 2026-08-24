'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  tenantId: string;
  role: 'super_admin' | 'admin';
  createdAt: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (name: string, company: string, email: string, pass: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        let tenantId = `tenant_${fbUser.uid.substring(0, 8)}`;
        let displayName = fbUser.displayName || fbUser.email?.split('@')[0] || 'Cliente NexAI';

        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            tenantId = data.tenantId || tenantId;
            displayName = data.displayName || displayName;
          }
        } catch (e) {
          console.warn('Firestore user fetch fallback:', e);
        }

        const profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email || '',
          displayName,
          tenantId,
          role: 'admin',
          createdAt: new Date().toISOString(),
        };

        setUser(profile);
        if (typeof window !== 'undefined') {
          localStorage.setItem('crm_active_user', JSON.stringify(profile));
        }
      } else {
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('crm_active_user');
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const profile: UserProfile = {
        uid: res.user.uid,
        email: res.user.email || email,
        displayName: res.user.displayName || email.split('@')[0],
        tenantId: `tenant_${res.user.uid.substring(0, 8)}`,
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      setUser(profile);
    } catch (err: any) {
      setIsLoading(false);
      throw new Error(err.message || 'Error al iniciar sesión');
    }
  };

  const registerWithEmail = async (name: string, company: string, email: string, pass: string) => {
    setIsLoading(true);
    const tenantSlug = company.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const tenantId = `tenant_${tenantSlug || Date.now().toString(36)}`;

    try {
      const res = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const profile: UserProfile = {
        uid: res.user.uid,
        email: res.user.email || email,
        displayName: company || name,
        tenantId,
        role: 'admin',
        createdAt: new Date().toISOString(),
      };

      // Persistir usuario y tenant en Firestore
      try {
        await setDoc(doc(db, 'users', res.user.uid), {
          uid: res.user.uid,
          email: res.user.email,
          displayName: company || name,
          tenantId,
          role: 'admin',
          createdAt: new Date().toISOString(),
        });

        await setDoc(doc(db, 'tenants', tenantId), {
          id: tenantId,
          name: company || name,
          slug: tenantSlug,
          plan: 'trial',
          currency: 'PEN',
          ownerUid: res.user.uid,
          createdAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Firestore setDoc error:', e);
      }

      setUser(profile);
    } catch (err: any) {
      setIsLoading(false);
      throw new Error(err.message || 'Error al registrar cuenta');
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const profile: UserProfile = {
        uid: res.user.uid,
        email: res.user.email || '',
        displayName: res.user.displayName || 'Usuario Google',
        tenantId: `tenant_${res.user.uid.substring(0, 8)}`,
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      setUser(profile);
    } catch (err: any) {
      setIsLoading(false);
      throw new Error(err.message || 'Error con Google Sign-In');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('crm_active_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
