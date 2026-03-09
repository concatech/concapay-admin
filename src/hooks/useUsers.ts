"use client";

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { User, Transaction, PendingFund, PaginatedResponse, PaginationParams } from '@/types';

export interface UserFilters extends PaginationParams {
  email?: string;
  is_admin?: boolean;
}

export interface UserTransactionFilters extends PaginationParams {
  status?: string;
  transaction_id?: string;
  inserted_at_start?: string;
  inserted_at_end?: string;
}

export interface UserPendingFundFilters extends PaginationParams {
  status?: string;
  inserted_at_start?: string;
  inserted_at_end?: string;
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
 * Hook para buscar fundos pendentes de um usuário com paginação server-side
 */
export const useUserPendingFunds = (userId: string, filters?: UserPendingFundFilters) => {
  return useQuery<PaginatedResponse<PendingFund>, Error>({
    queryKey: [
      'user-pending-funds',
      userId,
      filters?.page,
      filters?.limit,
      filters?.status,
      filters?.inserted_at_start,
      filters?.inserted_at_end,
    ],
    queryFn: () => api.getUserPendingFunds(userId, filters),
    enabled: !!userId,
  });
};

/**
 * Hook para buscar transações de um usuário com paginação server-side
 */
export const useUserTransactions = (userId: string, filters?: UserTransactionFilters) => {
  return useQuery<PaginatedResponse<Transaction>, Error>({
    queryKey: [
      'user-transactions',
      userId,
      filters?.page,
      filters?.limit,
      filters?.status,
      filters?.transaction_id,
      filters?.inserted_at_start,
      filters?.inserted_at_end,
    ],
    queryFn: () => api.getUserTransactions(userId, filters),
    enabled: !!userId,
  });
};
