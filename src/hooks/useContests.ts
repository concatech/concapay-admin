"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { Contest, PaginatedResponse, PaginationParams } from '@/types';

export interface ContestFilters extends PaginationParams {
  status?: string;
  user_id?: string;
}

/**
 * Hook para buscar contests com paginação server-side e cache
 * QueryKey usa valores primitivos para garantir cache consistente
 */
export const useContests = (filters?: ContestFilters) => {
  return useQuery<PaginatedResponse<Contest>, Error>({
    queryKey: [
      'contests',
      filters?.page,
      filters?.limit,
      filters?.status,
      filters?.user_id,
    ],
    queryFn: () => api.getContests(filters),
  });
};

/**
 * Hook para buscar um contest específico
 */
export const useContest = (contestId: string) => {
  return useQuery({
    queryKey: ['contest', contestId],
    queryFn: () => api.getContest(contestId),
    enabled: !!contestId,
  });
};

/**
 * Hook para aprovar um contest
 */
export const useApproveContest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contestId, adminNotes }: { contestId: string; adminNotes: string }) =>
      api.approveContest(contestId, adminNotes),
    onSuccess: () => {
      // Invalida a lista de contests para refetch
      queryClient.invalidateQueries({ queryKey: ['contests'] });
    },
  });
};

/**
 * Hook para rejeitar um contest
 */
export const useRejectContest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contestId, adminNotes }: { contestId: string; adminNotes: string }) =>
      api.rejectContest(contestId, adminNotes),
    onSuccess: () => {
      // Invalida a lista de contests para refetch
      queryClient.invalidateQueries({ queryKey: ['contests'] });
    },
  });
};
