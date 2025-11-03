import type {
  DashboardData,
  User,
  UserBalance,
  PendingFund,
  Transaction,
  Contest,
  Order,
  WebhookEvent,
} from '@/types';

const API_BASE_URL = 'https://concapay-back.fly.dev/api/v1';

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

export const api = {
  // Dashboard
  getDashboard: async (filters?: {
    start_date?: string;
    end_date?: string;
  }): Promise<DashboardData> => {
    const params = new URLSearchParams(filters as any);
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
  }): Promise<User[]> => {
    const params = new URLSearchParams(filters as any);
    const response = await fetch(`${API_BASE_URL}/admin/users?${params}`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return data.data;
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

  getUserPendingFunds: async (userId: string): Promise<PendingFund[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/pending-funds`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error('Failed to fetch pending funds');
    }
    const data = await response.json();
    return data.data || [];
  },

  getUserTransactions: async (userId: string): Promise<Transaction[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/transactions`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error('Failed to fetch transactions');
    }
    const data = await response.json();
    return data.data;
  },

  // Contests
  getContests: async (filters?: {
    status?: string;
    user_id?: string;
  }): Promise<{ total: number; contests: Contest[] }> => {
    const params = new URLSearchParams(filters as any);
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
  }): Promise<Order[]> => {
    const params = new URLSearchParams(filters as any);
    const response = await fetch(`${API_BASE_URL}/admin/orders?${params}`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!response.ok) {
      handleAuthError(response);
      throw new Error('Failed to fetch orders');
    }
    const data = await response.json();
    return data.data;
  },

  // Webhooks
  getWebhookEvents: async (filters?: {
    action?: string;
    status?: string;
    event_type?: string;
    mercado_pago_order_id?: string;
  }): Promise<{ count: number; data: WebhookEvent[] }> => {
    const params = new URLSearchParams(filters as any);
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
};
