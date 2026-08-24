'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LiveSandboxPreview } from '@/components/builder/LiveSandboxPreview';
import { Sparkles } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';

export default function PublicSitePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [jsxCode, setJsxCode] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('Sitio Oficial');

  useEffect(() => {
    async function load() {
      try {
        if (db && slug) {
          const docRef = doc(db, 'websites', slug);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.jsxCode) {
              setJsxCode(data.jsxCode);
              setTitle(data.title || data.businessName || slug);
              return;
            }
          }

          const q = query(collection(db, 'websites'), where('slug', '==', slug), limit(1));
          const snapList = await getDocs(q);
          if (!snapList.empty) {
            const data = snapList.docs[0].data();
            if (data.jsxCode) {
              setJsxCode(data.jsxCode);
              setTitle(data.title || data.businessName || slug);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Firestore website fetch fallback:', err);
      }

      // Fallback: Generación inicial con Apio
      try {
        const prompt = slug ? slug.replace(/-/g, ' ') : 'Pizzería y Panadería en Piura';
        const res = await fetch('/api/builder/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, businessName: slug }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.jsxCode) {
            setJsxCode(data.jsxCode);
            setTitle(data.title || slug);
            return;
          }
        }
      } catch (e) {}

      setJsxCode('function App() { return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center text-sm font-bold">Bienvenido a ' + (slug || 'nuestro sitio web') + '</div>; }');
    }
    load();
  }, [slug]);

  if (!jsxCode) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-300 text-xs gap-3 font-mono">
        <Sparkles className="w-7 h-7 animate-spin text-emerald-400" />
        <span>Apio Sandbox está cargando la aplicación...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-0 sm:p-4 flex justify-center">
      <LiveSandboxPreview jsxCode={jsxCode} title={title} deviceView="desktop" />
    </div>
  );
}
