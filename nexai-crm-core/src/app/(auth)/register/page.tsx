'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { UserPlus, Globe, Loader2 } from 'lucide-react';

function RegisterForm() {
  const searchParams = useSearchParams();
  const { registerWithEmail, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [slug, setSlug] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (searchParams) {
      const compParam = searchParams.get('company');
      const slugParam = searchParams.get('slug');
      if (compParam) setCompany(compParam);
      if (slugParam) setSlug(slugParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerWithEmail(name, company, email, password, slug);
  };

  return (
    <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
      <div className="text-center space-y-1">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-2xl mx-auto shadow-lg shadow-emerald-500/20">
          N
        </div>
        <h1 className="text-xl font-extrabold tracking-tight text-white">
          Crear Cuenta de Administrador
        </h1>
        <p className="text-xs text-emerald-400 font-medium">
          Prueba gratuita de 14 días • Panel CRM + WhatsApp IA
        </p>
      </div>

      {company && (
        <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-xs text-blue-300 flex items-center gap-2">
          <Globe className="w-4 h-4 flex-shrink-0 text-blue-400" />
          <span>Vinculando automáticamente a tu sitio web <strong>{company}</strong></span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Tu Nombre Completo"
          placeholder="Ej. Gian Pierre Sernaqué"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Nombre de tu Empresa / Negocio"
          placeholder="Ej. Kira's Pizza Artesanal"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <Input
          label="Correo Electrónico de Administrador"
          type="email"
          placeholder="admin@tuempresa.pe"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="space-y-1">
          <label className="block text-xs font-medium text-slate-300">Contraseña de Acceso</label>
          <input
            type="password"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3.5 py-2 text-sm bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <Button type="submit" variant="success" isLoading={isLoading} className="w-full py-2.5 font-bold" leftIcon={<UserPlus className="w-4 h-4" />}>
          Registrar & Activar Mi CRM
        </Button>
      </form>

      <div className="text-center text-xs text-slate-400">
        ¿Ya tienes cuenta registrada?{' '}
        <Link href="/login" className="text-blue-400 font-bold hover:underline">
          Iniciar Sesión
        </Link>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-slate-100 relative">
      <Suspense fallback={
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          <span>Cargando registro seguro...</span>
        </div>
      }>
        <RegisterForm />
      </Suspense>
    </div>
  );
}
