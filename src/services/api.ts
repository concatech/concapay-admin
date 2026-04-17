import type {
  DashboardData,
  User,
  UserBalance,
  PendingFund,
  Transaction,
  Contest,
  Order,
  WebhookEvent,
  PaginatedResponse,
  ReconciliationResponse,
} from '@/types';
import { API_BASE_URL } from '@/config/api';

const getHeaders = () => {
  // Em produção, pegar tokens do cookie/context
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : '';
  const csrfToken = typeof window !== 'undefined' ? localStorage.getItem('csrf_token') : '';
  
  return {
    'accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    'x-csrf-token': csrfToken || '',
  };
};

const handleAuthError = (response: Response) => {
  if (response.status === 401 || response.status === 403) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('csrf_token');
      window.location.href = '/login';
    }
    throw new Error('Sessão expirada. Por favor, faça login novamente.');
  }
};

const buildSearchParams = (filters?: Record<string, string | undefined>): URLSearchParams => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });
  }
  return params;
};

export const api = {
  // Dashboard
  getDashboard: async (filters?: {
    start_date?: string;
    end_date?: string;
  }): Promise<DashboardData> => {
    const params = buildSearchParams(filters);
    const response = await fetch(`${API_BASE_URL}/admin/dashboard?${params}`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error('Failed to fetch dashboard data');
    }
    const data = await response.json();
    return data.data;
  },

  // Users
  getUsers: async (filters?: {
    email?: string;
    is_admin?: boolean;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<User>> => {
    const params = buildSearchParams(
      filters ? { 
        ...filters, 
        is_admin: filters.is_admin?.toString(),
        page: filters.page?.toString(),
        limit: filters.limit?.toString()
      } : undefined
    );
    const response = await fetch(`${API_BASE_URL}/admin/users?${params}`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error('Failed to fetch users');
    }
    return response.json();
  },

  getUserBalance: async (userId: string): Promise<UserBalance> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/balance`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error('Failed to fetch user balance');
    }
    const data = await response.json();
    return data.data;
  },

  getUserPendingFunds: async (userId: string, filters?: {
    page?: number;
    limit?: number;
    status?: string;
    inserted_at_start?: string;
    inserted_at_end?: string;
  }): Promise<PaginatedResponse<PendingFund>> => {
    const params = buildSearchParams(
      filters ? {
        ...filters,
        page: filters.page?.toString(),
        limit: filters.limit?.toString(),
      } : undefined
    );
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/pending-funds?${params}`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error('Failed to fetch pending funds');
    }
    return response.json();
  },

  getUserTransactions: async (userId: string, filters?: {
    page?: number;
    limit?: number;
    status?: string;
    transaction_id?: string;
    inserted_at_start?: string;
    inserted_at_end?: string;
  }): Promise<PaginatedResponse<Transaction>> => {
    const params = buildSearchParams(
      filters ? {
        ...filters,
        page: filters.page?.toString(),
        limit: filters.limit?.toString(),
      } : undefined
    );
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/transactions?${params}`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error('Failed to fetch transactions');
    }
    return response.json();
  },

  resetUserPassword: async (email: string, password: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/reset-password`, {
      method: 'POST',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      handleAuthError(response);
      if (response.status === 422) {
        throw new Error('Formato de senha inválido. Mínimo 6 caracteres, 1 maiúscula, 1 minúscula e 1 número/símbolo.');
      }
      if (response.status === 404) {
        throw new Error('Usuário não encontrado.');
      }
      throw new Error('Falha ao redefinir senha');
    }
    return response.json();
  },

  // Contests
  getContests: async (filters?: {
    status?: string;
    user_id?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Contest>> => {
    const params = buildSearchParams(
      filters ? {
        ...filters,
        page: filters.page?.toString(),
        limit: filters.limit?.toString()
      } : undefined
    );
    const response = await fetch(`${API_BASE_URL}/admin/contests?${params}`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error('Failed to fetch contests');
    }
    return response.json();
  },

  getContest: async (contestId: string): Promise<Contest> => {
    const response = await fetch(`${API_BASE_URL}/admin/contests/${contestId}`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error('Failed to fetch contest');
    }
    const data = await response.json();
    return data.contest;
  },

  approveContest: async (contestId: string, adminNotes: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admin/contests/${contestId}/approve`, {
      method: 'POST',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_notes: adminNotes, status: 'approved' }),
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error('Failed to approve contest');
    }
  },

  rejectContest: async (contestId: string, adminNotes: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admin/contests/${contestId}/reject`, {
      method: 'POST',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_notes: adminNotes, status: 'rejected' }),
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error('Failed to reject contest');
    }
  },

  // Orders
  getOrders: async (filters?: {
    status?: string;
    user_id?: string;
    payment_method?: string;
    product_id?: string;
    inserted_at_start?: string;
    inserted_at_end?: string;
    buyer_email?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Order>> => {
    const params = buildSearchParams(
      filters ? {
        ...filters,
        page: filters.page?.toString(),
        limit: filters.limit?.toString()
      } : undefined
    );
    const response = await fetch(`${API_BASE_URL}/admin/orders?${params}`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error('Failed to fetch orders');
    }
    return response.json();
  },

  // Reconciliations
  getReconciliations: async (filters?: {
    order_id?: string;
    reconciled_by_type?: string;
    from?: string;
    to?: string;
    page?: number;
    page_size?: number;
  }): Promise<ReconciliationResponse> => {
    const params = buildSearchParams(
      filters ? {
        ...filters,
        page: filters.page?.toString(),
        page_size: filters.page_size?.toString(),
      } : undefined
    );
    const response = await fetch(`${API_BASE_URL}/admin/reconciliations?${params}`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error('Failed to fetch reconciliations');
    }
    return response.json();
  },

  reconcileOrder: async (orderId: string): Promise<{
    success: boolean;
    message: string;
    data: {
      order_id: string;
      previous_status: string;
      new_status: string;
      reconciled_at: string;
      reconciled_by: { id: string; email: string };
    };
  }> => {
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/reconcile`, {
      method: 'POST',
      headers: getHeaders(),
    });
    if (!response.ok) {
      handleAuthError(response);
      if (response.status === 404) {
        throw new Error('Pedido não encontrado.');
      }
      if (response.status === 422) {
        throw new Error('Falha na reconciliação.');
      }
      throw new Error('Failed to reconcile order');
    }
    return response.json();
  },

  // Webhooks
  getWebhookEvents: async (filters?: {
    action?: string;
    status?: string;
    event_type?: string;
    order_id?: string;
    page?: number;
    limit?: number;
    inserted_at_start?: string;
    inserted_at_end?: string;
  }): Promise<PaginatedResponse<WebhookEvent>> => {
    const params = buildSearchParams(
      filters ? {
        ...filters,
        page: filters.page?.toString(),
        limit: filters.limit?.toString(),
      } : undefined
    );
    const response = await fetch(`${API_BASE_URL}/webhooks/events?${params}`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error('Failed to fetch webhook events');
    }
    return response.json();
  },

  getOrderWebhookEvents: async (orderId: string): Promise<{ count: number; data: WebhookEvent[] }> => {
    const response = await fetch(`${API_BASE_URL}/webhooks/orders/${orderId}/events`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error('Failed to fetch order webhook events');
    }
    return response.json();
  },

  getMercadoPagoWebhookEvents: async (mpOrderId: string): Promise<{ count: number; data: WebhookEvent[] }> => {
    const response = await fetch(`${API_BASE_URL}/webhooks/mercado_pago/${mpOrderId}/events`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error('Failed to fetch Mercado Pago webhook events');
    }
    return response.json();
  },

  getExternalRefWebhookEvents: async (externalReference: string): Promise<{ count: number; data: WebhookEvent[] }> => {
    const response = await fetch(`${API_BASE_URL}/webhooks/external/${externalReference}/events`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error('Failed to fetch external reference webhook events');
    }
    return response.json();
  },
};
