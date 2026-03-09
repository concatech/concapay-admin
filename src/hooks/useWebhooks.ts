"use client";

import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import type { WebhookEvent, PaginatedResponse, PaginationParams } from '@/types';

export interface WebhookFilters extends PaginationParams {
  action?: string;
  status?: string;
  event_type?: string;
  order_id?: string;
  inserted_at_start?: string;
  inserted_at_end?: string;
}

export const useWebhookEvents = (filters?: WebhookFilters) => {
  return useQuery<PaginatedResponse<WebhookEvent>, Error>({
    queryKey: [
      'webhook-events',
      filters?.page,
      filters?.limit,
      filters?.action,
      filters?.status,
      filters?.event_type,
      filters?.order_id,
      filters?.inserted_at_start,
      filters?.inserted_at_end,
    ],
    queryFn: () => api.getWebhookEvents(filters),
  });
};

export const useMercadoPagoWebhookEvents = (mpOrderId: string) => {
  return useQuery<{ count: number; data: WebhookEvent[] }, Error>({
    queryKey: ['webhook-events-mp', mpOrderId],
    queryFn: () => api.getMercadoPagoWebhookEvents(mpOrderId),
    enabled: !!mpOrderId,
  });
};

export const useExternalRefWebhookEvents = (externalReference: string) => {
  return useQuery<{ count: number; data: WebhookEvent[] }, Error>({
    queryKey: ['webhook-events-external', externalReference],
    queryFn: () => api.getExternalRefWebhookEvents(externalReference),
    enabled: !!externalReference,
  });
};
