'use client';

import React, { useState } from 'react';
import { TenantProvider } from '@/context/TenantContext';
import { CRMDataProvider } from '@/context/CRMDataContext';
import { WhatsAppBotProvider } from '@/context/WhatsAppBotContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { AuthGuard } from '@/components/layout/AuthGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <AuthGuard>
      <TenantProvider>
        <CRMDataProvider>
          <WhatsAppBotProvider>
            <div className="flex h-screen bg-slate-950 overflow-hidden">
              <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
              <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/50">{children}</main>
              </div>
              <CommandPalette />
            </div>
          </WhatsAppBotProvider>
        </CRMDataProvider>
      </TenantProvider>
    </AuthGuard>
  );
}
