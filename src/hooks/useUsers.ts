"use client";

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { User, PaginatedResponse, PaginationParams } from '@/types';

export interface UserFilters extends PaginationParams {
  email?: string;
  is_admin?: boolean;
}

/**
 * Hook para buscar users com paginação server-side e cache
 * QueryKey usa valores primitivos para garantir cache consistente
 */
export const useUsers = (filters?: UserFilters) => {
  return useQuery<PaginatedResponse<User>, Error>({
    queryKey: [
      'users',
      filters?.page,
      filters?.limit,
      filters?.email,
      filters?.is_admin,
    ],
    queryFn: () => api.getUsers(filters),
  });
};

/**
 * Hook para buscar saldo de um usuário específico
 */
export const useUserBalance = (userId: string) => {
  return useQuery({
    queryKey: ['user-balance', userId],
    queryFn: () => api.getUserBalance(userId),
    enabled: !!userId,
  });
};

/**
 * Hook para buscar fundos pendentes de um usuário
 */
export const useUserPendingFunds = (userId: string) => {
  return useQuery({
    queryKey: ['user-pending-funds', userId],
    queryFn: () => api.getUserPendingFunds(userId),
    enabled: !!userId,
  });
};

/**
 * Hook para buscar transações de um usuário
 */
export const useUserTransactions = (userId: string) => {
  return useQuery({
    queryKey: ['user-transactions', userId],
    queryFn: () => api.getUserTransactions(userId),
    enabled: !!userId,
  });
};
