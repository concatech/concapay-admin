"use client";

import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        retry: 1,
        staleTime: 30 * 1000, // 30 segundos
        gcTime: 5 * 60 * 1000, // 5 minutos
      },
      mutations: {
        retry: 1,
      },
    },
  });
}

/**
 * Provider component para envolver a aplicação.
 * Usa useState para garantir que o QueryClient persista
 * enquanto o componente estiver montado (sobrevive a
 * re-avaliações de módulo pelo Next.js/HMR).
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(makeQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

/**
 * Hook para invalidação de queries.
 * Usa useQueryClient() para acessar o client do contexto,
 * garantindo que sempre referencia a instância correta.
 */
export function useQueryInvalidation() {
  const queryClient = useQueryClient();

  return {
    invalidateOrders: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
    invalidateUsers: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
    invalidateContests: () => queryClient.invalidateQueries({ queryKey: ['contests'] }),
    invalidateDashboard: () => queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    reset: () => queryClient.resetQueries(),
  };
}
