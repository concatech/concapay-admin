"use client";

import { useState } from 'react';
import { Home, Users, ShoppingCart, AlertTriangle, Webhook, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const menuItems = [
  { title: 'Visão geral',    icon: Home,          url: '/dashboard' },
  { title: 'Usuários',       icon: Users,         url: '/users' },
  { title: 'Vendas',         icon: ShoppingCart,  url: '/orders' },
  { title: 'Contestações',   icon: AlertTriangle, url: '/contests' },
  { title: 'Reconciliações', icon: RefreshCw,     url: '/reconciliations' },
  { title: 'Webhooks',       icon: Webhook,       url: '/webhooks' },
];

interface AppSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const pathname = usePathname();
  const [logoError, setLogoError] = useState(false);

  return (
    <div
      className={cn(
        // Base
        'bg-white border-gray-200 flex flex-col overflow-hidden shrink-0',
        // Mobile: fixed overlay, desliza para dentro/fora
        'fixed inset-y-0 left-0 z-50 w-[224px] border-r',
        'transition-transform duration-300 ease-in-out',
        open ? 'translate-x-0' : '-translate-x-full',
        // Desktop: inline no fluxo, colapsa via width
        'md:static md:z-auto md:translate-x-0',
        'md:transition-[width] md:duration-300 md:ease-in-out',
        open ? 'md:w-[224px] md:border-r' : 'md:w-0 md:border-r-0',
      )}
    >
      {/* Conteúdo fixo em 224px; o overflow-hidden do pai faz o clip */}
      <div className="w-[224px] flex flex-col h-full">
        <div className="flex items-center justify-center h-[77px] bg-[#20304c] p-4 rounded-bl-lg rounded-br-lg shrink-0">
          {logoError ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-white font-semibold text-lg">Concapay</span>
            </div>
          ) : (
            <img
              className="h-10 w-auto"
              src="/logo-sidebar.png"
              alt="Concapay"
              onError={() => setLogoError(true)}
            />
          )}
        </div>
        <nav className="px-[21px] py-6 flex-1 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.url || pathname?.startsWith(item.url + '/');
              return (
                <Link
                  key={item.title}
                  href={item.url}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-2 px-[10.5px] py-[7px] text-base font-medium rounded-[8.75px] transition-colors no-underline',
                    isActive
                      ? 'bg-[#e3e8f4] text-black'
                      : 'bg-[#fefefe] text-black hover:bg-gray-100',
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="whitespace-nowrap">{item.title}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
