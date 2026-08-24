'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-slate-100">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-lg font-bold text-white">Recuperar Contraseña</h1>
          <p className="text-xs text-slate-400">
            Ingresa tu correo para recibir un enlace de restablecimiento.
          </p>
        </div>

        {isSent ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="text-xs text-emerald-300">Enlace de recuperación enviado a {email}. Revisa tu bandeja de entrada.</p>
            <Link href="/login" className="text-xs text-blue-400 font-bold block pt-2">Volver a Iniciar Sesión</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full py-2.5 font-bold" leftIcon={<Mail className="w-4 h-4" />}>
              Enviar Enlace
            </Button>
            <Link href="/login" className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1.5 pt-2">
              <ArrowLeft className="w-3.5 h-3.5" /> Volver al Inicio de Sesión
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
