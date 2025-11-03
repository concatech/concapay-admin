"use client";

import { useState } from 'react';
import { Home, Users, ShoppingCart, AlertTriangle, Webhook } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Visão geral',
    icon: Home,
    url: '/dashboard',
  },
  {
    title: 'Usuários',
    icon: Users,
    url: '/users',
  },
  {
    title: 'Vendas',
    icon: ShoppingCart,
    url: '/orders',
  },
  {
    title: 'Contestações',
    icon: AlertTriangle,
    url: '/contests',
  },
  {
    title: 'Webhooks',
    icon: Webhook,
    url: '/webhooks',
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="bg-white border-r border-gray-200 w-[224px] min-h-screen flex flex-col">
      <div className="flex items-center justify-center h-[77px] bg-[#20304c] p-4 rounded-bl-lg rounded-br-lg">
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
      <div className="px-[21px] py-6 flex-1">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.url || pathname?.startsWith(item.url + '/');
            return (
              <Link
                key={item.title}
                href={item.url}
                className={cn(
                  "flex items-center gap-2 px-[10.5px] py-[7px] text-base font-medium rounded-[8.75px] transition-colors no-underline",
                  isActive
                    ? "bg-[#e3e8f4] text-black"
                    : "bg-[#fefefe] text-black hover:bg-gray-100"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

