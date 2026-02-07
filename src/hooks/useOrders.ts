"use client";

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Order, PaginatedResponse, PaginationParams } from '@/types';

export interface OrderFilters extends PaginationParams {
  status?: string;
  user_id?: string;
  payment_method?: string;
  product_id?: string;
  inserted_at_start?: string;
  inserted_at_end?: string;
  buyer_email?: string;
}

/**
 * Hook para buscar orders com paginação server-side e cache
 * QueryKey usa valores primitivos para garantir cache consistente
 */
export const useOrders = (filters?: OrderFilters) => {
  return useQuery<PaginatedResponse<Order>, Error>({
    queryKey: [
      'orders',
      filters?.page,
      filters?.limit,
      filters?.status,
      filters?.payment_method,
      filters?.buyer_email,
      filters?.inserted_at_start,
      filters?.inserted_at_end,
    ],
    queryFn: () => api.getOrders(filters),
  });
};
