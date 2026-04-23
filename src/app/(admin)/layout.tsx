"use client";

import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { cn } from '@/lib/utils';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(min-width: 768px)').matches;
  });

  // Mantém o sidebar aberto/fechado ao cruzar o breakpoint
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');

    const onChange = (e: MediaQueryListEvent) => {
      setSidebarOpen(e.matches);
    };

    // Estado inicial já vem do initializer; aqui só assinamos mudanças.
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggleSidebar = () => setSidebarOpen((v) => !v);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Backdrop mobile */}
        <div
          className={cn(
            'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 md:hidden',
            sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
          )}
          onClick={closeSidebar}
        />

        <AppSidebar open={sidebarOpen} onClose={closeSidebar} />

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <AppHeader onToggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-auto bg-background">{children}</main>
        </div>
        <Toaster position="top-right" />
      </div>
    </ProtectedRoute>
  );
}
