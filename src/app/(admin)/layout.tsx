"use client";

import { useState } from 'react';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { AppHeader } from '@/components/layout/AppHeader';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <ProtectedRoute>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar open={sidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <AppHeader onToggleSidebar={() => setSidebarOpen((v) => !v)} />
          <main className="flex-1 overflow-auto bg-background">{children}</main>
        </div>
        <Toaster position="top-right" />
      </div>
    </ProtectedRoute>
  );
}
