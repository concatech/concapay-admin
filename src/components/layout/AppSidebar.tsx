"use client";

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

  return (
    <div className="bg-white border-r border-gray-200 w-64 min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold">C</span>
          </div>
          <span className="text-gray-900 font-semibold text-lg">Concapay</span>
        </div>
      </div>
      <div className="p-3 flex-1">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.url || pathname?.startsWith(item.url + '/');
            return (
              <Link
                key={item.title}
                href={item.url}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors no-underline",
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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

