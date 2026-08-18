"use client";

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Withdrawal, PaginatedResponse, PaginationParams } from '@/types';

export interface WithdrawalFilters extends PaginationParams {
  status?: string;
}

/**
 * Hook para buscar saques com paginação server-side e cache
 * QueryKey usa valores primitivos para garantir cache consistente
 */
export const useWithdrawals = (filters?: WithdrawalFilters) => {
  return useQuery<PaginatedResponse<Withdrawal>, Error>({
    queryKey: [
      'withdrawals',
      filters?.page,
      filters?.limit,
      filters?.status,
    ],
    queryFn: () => api.getWithdrawals(filters),
  });
};
