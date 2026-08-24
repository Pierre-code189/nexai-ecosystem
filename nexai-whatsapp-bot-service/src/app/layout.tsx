import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'NexAI WhatsApp Bot Service - Microservicio de Conectividad & Asistente IA',
  description: 'Conexión directa por QR (Baileys WebSocket), notas de voz Whisper y cobros Yape/Plin.',
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
