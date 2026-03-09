"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { ReconciliationResponse } from '@/types';

export interface ReconciliationFilters {
  order_id?: string;
  reconciled_by_type?: string;
  from?: string;
  to?: string;
  page?: number;
  page_size?: number;
}

export const useReconciliations = (filters?: ReconciliationFilters) => {
  return useQuery<ReconciliationResponse, Error>({
    queryKey: [
      'reconciliations',
      filters?.page,
      filters?.page_size,
      filters?.order_id,
      filters?.reconciled_by_type,
      filters?.from,
      filters?.to,
    ],
    queryFn: () => api.getReconciliations(filters),
  });
};

export const useReconcileOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => api.reconcileOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reconciliations'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
