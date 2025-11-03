"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '@/services/auth.service';

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsLoading(false);

      // Se não estiver autenticado e estiver em rota protegida, redirecionar
      if (!authenticated && pathname !== '/login' && !pathname.startsWith('/login')) {
        router.push('/login');
      }

      // Se estiver autenticado e na página de login, redirecionar para dashboard
      if (authenticated && pathname === '/login') {
        router.push('/dashboard');
      }
    };

    checkAuth();
  }, [pathname, router]);

  return {
    isAuthenticated: isAuthenticated ?? false,
    isLoading,
    logout: authService.logout,
  };
}

