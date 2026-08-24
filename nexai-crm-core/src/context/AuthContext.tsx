'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, AuthState } from '@/types/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase/config';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType extends AuthState {
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (name: string, company: string, email: string, pass: string, slug?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Lectura dinámica y segura de la lista de Super Administradores desde Variables de Entorno
const getSuperAdminEmails = (): string[] => {
  if (typeof window === 'undefined') return [];
  const raw = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAILS || '';
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
};

const resolveRole = (email: string, firestoreRole?: string): 'super_admin' | 'admin' => {
  if (firestoreRole === 'super_admin') return 'super_admin';
  const superAdmins = getSuperAdminEmails();
  if (email && superAdmins.includes(email.toLowerCase())) {
    return 'super_admin';
  }
  return 'admin';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          const userEmail = fbUser.email || '';
          let tenantId = `tenant_${fbUser.uid.substring(0, 8)}`;
          let displayName = fbUser.displayName || userEmail.split('@')[0] || 'Usuario';
          let role: 'super_admin' | 'admin' = resolveRole(userEmail);

          // Obtener perfil y rol real persistido en Firestore
          try {
            const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              tenantId = data.tenantId || tenantId;
              displayName = data.displayName || displayName;
              if (data.role) {
                role = data.role === 'super_admin' ? 'super_admin' : resolveRole(userEmail, data.role);
              }
            } else {
              // Registro inicial seguro en Firestore
              await setDoc(doc(db, 'users', fbUser.uid), {
                uid: fbUser.uid,
                email: userEmail,
                displayName,
                tenantId,
                role,
                createdAt: new Date().toISOString(),
              });
            }
          } catch {
            // fallback
          }

          const profile: UserProfile = {
            uid: fbUser.uid,
            email: userEmail,
            displayName,
            tenantId,
            role,
            photoURL: fbUser.photoURL || undefined,
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
    } else {
      setIsLoading(false);
    }
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const userEmail = res.user.email || email.trim();
      const role = resolveRole(userEmail);
      const profile: UserProfile = {
        uid: res.user.uid,
        email: userEmail,
        displayName: res.user.displayName || userEmail.split('@')[0],
        tenantId: `tenant_${res.user.uid.substring(0, 8)}`,
        role,
        createdAt: new Date().toISOString(),
      };
      setUser(profile);
      router.push('/dashboard');
    } catch (err: any) {
      setIsLoading(false);
      throw new Error(err.message || 'Error al iniciar sesión');
    }
  };

  const registerWithEmail = async (name: string, company: string, email: string, pass: string, slug?: string) => {
    setIsLoading(true);
    const userEmail = email.trim();
    const role = resolveRole(userEmail);
    const tenantSlug = slug || company.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const tenantId = `tenant_${tenantSlug}`;

    try {
      const res = await createUserWithEmailAndPassword(auth, userEmail, pass);
      const profile: UserProfile = {
        uid: res.user.uid,
        email: userEmail,
        displayName: company || name,
        tenantId,
        role,
        createdAt: new Date().toISOString(),
      };

      try {
        await setDoc(doc(db, 'users', res.user.uid), {
          uid: res.user.uid,
          email: userEmail,
          displayName: company || name,
          tenantId,
          role,
          createdAt: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Registro de usuario en Firestore:', e);
      }

      setUser(profile);
      router.push('/dashboard');
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
      const userEmail = res.user.email || '';
      const role = resolveRole(userEmail);
      const profile: UserProfile = {
        uid: res.user.uid,
        email: userEmail,
        displayName: res.user.displayName || 'Usuario Google',
        tenantId: `tenant_${res.user.uid.substring(0, 8)}`,
        role,
        photoURL: res.user.photoURL || undefined,
        createdAt: new Date().toISOString(),
      };
      setUser(profile);
      router.push('/dashboard');
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
    router.push('/login');
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
