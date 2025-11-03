# 🚀 Quick Start - Concapay Admin

## ⚡ Início Rápido (10 minutos)

### 1. Instalar Dependências Base

```bash
cd concapay-admin

# Adicionar dependências principais
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react date-fns sonner
```

### 2. Configurar shadcn/ui

```bash
# Inicializar shadcn/ui
npx shadcn@latest init

# Quando perguntado, escolha:
# - TypeScript: Yes
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
# - Tailwind config: Yes
# - Components path: src/components/ui
# - Utils path: src/lib/utils
# - React Server Components: Yes
```

### 3. Instalar Componentes shadcn/ui Necessários

```bash
# Componentes essenciais (executar um por vez ou todos juntos)
npx shadcn@latest add button card input table badge skeleton dialog tabs select popover calendar textarea label sidebar
```

### 4. Criar Estrutura de Pastas

```bash
mkdir -p src/app/(admin)/{dashboard,users,orders,contests,webhooks}
mkdir -p src/app/(admin)/users/[id]
mkdir -p src/components/{layout,filters,shared,pages}
mkdir -p src/services
mkdir -p src/types
mkdir -p src/hooks
```

---

## 📁 Arquivos Iniciais para Criar

### 1. `src/types/index.ts`

```typescript
// Dashboard Types
export interface DashboardData {
  active_users: number;
  generated_at: string;
  pending_contests_amount: string;
  pending_contests_count: number;
  total_commission: string;
  total_orders: number;
  total_pending_funds: string;
  gmv?: string;
}

// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  inserted_at: string;
  updated_at: string;
  is_admin: boolean;
}

export interface UserBalance {
  user_id: string;
  available_balance: string;
  contested_balance: string;
  pending_balance: string;
  total_balance: string;
}

// Fund Types
export type FundStatus = 'pending' | 'released' | 'cancelled' | 'contested';

export interface PendingFund {
  id: string;
  status: FundStatus;
  amount: string;
  order_id: string;
  user_account: {
    id: string;
    available_balance: string;
    pending_balance: string;
  };
  created_at: string;
  release_at: string;
}

// Transaction Types
export type TransactionType =
  | 'commission_deduction'
  | 'funds_pending'
  | 'funds_released'
  | 'withdrawal'
  | 'commission_reversal'
  | 'fund_cancellation'
  | 'balance_adjustment'
  | 'contest_approval';

export interface Transaction {
  id: string;
  description: string;
  order: {
    id: string;
    status: string;
    payment_method: string;
  };
  amount: string;
  inserted_at: string;
  processed_at: string;
  transaction_type: TransactionType;
}

// Contest Types
export type ContestStatus = 'pending' | 'approved' | 'rejected';

export interface Contest {
  id: string;
  reason: string;
  status: ContestStatus;
  user: {
    id: string;
    name: string;
    email: string;
  };
  updated_at: string;
  admin_notes: string | null;
  decided_at: string | null;
  admin: any | null;
  pending_fund: PendingFund;
  created_at: string;
}

// Order Types
export type OrderStatus = 'pending' | 'paid' | 'refunded' | 'expired';
export type PaymentMethod = 'pix' | 'credit_card' | 'boleto';

export interface Order {
  id: string;
  status: OrderStatus;
  user: {
    id: string;
    name: string;
    email: string;
    is_admin: boolean;
  };
  amount: string;
  inserted_at: string;
  updated_at: string;
  expires_at: string;
  user_id: string;
  buyer_email: string;
  pix_qr_code: string | null;
  pix_qr_code_base64: string | null;
  pix_ticket_url: string | null;
  status_detail: string;
  payment_method: PaymentMethod;
  offer: {
    id: string;
    name: string;
    product: {
      id: string;
      name: string;
      type: string | null;
      description: string;
      segment: string;
      community_url: string | null;
      info_product_url: string | null;
      product_image_url: string | null;
    };
    is_active: boolean;
    cash_value: string;
    hash_code: string;
  };
  paid_at: string | null;
  payment_provider: string;
  is_contested: boolean;
}

// Webhook Types
export type WebhookEventType = 'order' | 'payment' | 'unknown';
export type WebhookStatus = 'processed' | 'action_required' | 'failed';

export interface WebhookEvent {
  id: string;
  status: WebhookStatus;
  action: string;
  inserted_at: string;
  updated_at: string;
  event_type: WebhookEventType;
  order_id: string;
  processed_at: string;
  external_reference: string;
  status_detail: string;
  offer_id: string;
  total_amount: string;
  processing_error: string | null;
  total_paid_amount: string;
  mercado_pago_order_id: string;
  api_version: string;
  mercado_pago_payment_id: string;
  refunded_amount: string | null;
  webhook_received_at: string;
}
```

### 2. `src/lib/utils.ts` (atualizar com formatters)

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: string | number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(typeof value === 'string' ? parseFloat(value) : value);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}
```

### 3. `src/services/api.ts`

```typescript
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

// TODO: Implementar sistema de autenticação real
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

export const api = {
  // Dashboard
  getDashboard: async (filters?: {
    start_date?: string;
    end_date?: string;
  }): Promise<DashboardData> => {
    const params = new URLSearchParams(filters as any);
    const response = await fetch(`${API_BASE_URL}/admin/dashboard?${params}`, {
      headers: getHeaders(),
    });
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
    });
    const data = await response.json();
    return data.data;
  },

  getUserBalance: async (userId: string): Promise<UserBalance> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/balance`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    return data.data;
  },

  getUserPendingFunds: async (userId: string): Promise<PendingFund[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/pending-funds`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    return data.data || [];
  },

  getUserTransactions: async (userId: string): Promise<Transaction[]> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/transactions`, {
      headers: getHeaders(),
    });
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
    });
    return response.json();
  },

  getContest: async (contestId: string): Promise<Contest> => {
    const response = await fetch(`${API_BASE_URL}/admin/contests/${contestId}`, {
      headers: getHeaders(),
    });
    const data = await response.json();
    return data.contest;
  },

  approveContest: async (contestId: string, adminNotes: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/admin/contests/${contestId}/approve`, {
      method: 'POST',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_notes: adminNotes, status: 'approved' }),
    });
  },

  rejectContest: async (contestId: string, adminNotes: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/admin/contests/${contestId}/reject`, {
      method: 'POST',
      headers: { ...getHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_notes: adminNotes, status: 'rejected' }),
    });
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
    });
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
    });
    return response.json();
  },

  getOrderWebhookEvents: async (orderId: string): Promise<{ count: number; data: WebhookEvent[] }> => {
    const response = await fetch(`${API_BASE_URL}/webhooks/orders/${orderId}/events`, {
      headers: getHeaders(),
    });
    return response.json();
  },
};
```

### 4. `src/app/(admin)/layout.tsx` (estrutura básica)

```typescript
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* TODO: Adicionar Sidebar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* TODO: Adicionar Header */}
        <main className="flex-1 overflow-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### 5. `src/app/(admin)/dashboard/page.tsx` (estrutura básica)

```typescript
export default async function DashboardPage() {
  // TODO: Implementar dashboard
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl mb-2">Visão Geral</h1>
        <p className="text-muted-foreground">Dashboard do admin</p>
      </div>
    </div>
  );
}
```

---

## 📋 Checklist Pré-Implementação

- [x] ✅ Plano completo criado (`PLANO_IMPLEMENTACAO.md`)
- [x] ✅ Mapeamento visual criado (`MAPEAMENTO_VISUAL.md`)
- [x] ✅ Quick start criado (`QUICK_START.md`)
- [ ] ⬜ Dependências instaladas
- [ ] ⬜ shadcn/ui configurado
- [ ] ⬜ Estrutura de pastas criada
- [ ] ⬜ Tipos TypeScript criados
- [ ] ⬜ Serviço de API criado
- [ ] ⬜ Componentes UI instalados

---

## 🎯 Próximos Comandos

```bash
# 1. Instalar dependências
npm install @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react date-fns sonner

# 2. Configurar shadcn/ui
npx shadcn@latest init

# 3. Instalar componentes
npx shadcn@latest add button card input table badge skeleton dialog tabs select popover calendar textarea label sidebar

# 4. Criar pastas
mkdir -p src/app/(admin)/{dashboard,users,orders,contests,webhooks}
mkdir -p src/app/(admin)/users/[id]
mkdir -p src/components/{layout,filters,shared,pages}
mkdir -p src/services
mkdir -p src/types
mkdir -p src/hooks

# 5. Iniciar servidor de desenvolvimento
npm run dev
```

---

## 📚 Recursos

- **Documentação shadcn/ui:** https://ui.shadcn.com/
- **Next.js App Router:** https://nextjs.org/docs/app
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Lucide Icons:** https://lucide.dev/
- **date-fns:** https://date-fns.org/

---

## 💡 Dicas

1. **Comece simples:** Implemente uma página por vez, testando antes de seguir para a próxima
2. **Use o projeto-modelo como referência:** Copie a estrutura visual e adapte para Next.js
3. **Server Components primeiro:** Use `'use client'` apenas quando necessário (estado, eventos)
4. **Mock data no início:** Use dados mock enquanto implementa o layout, depois conecte à API real
5. **Teste responsividade:** Verifique em mobile/tablet enquanto desenvolve

---

## 🐛 Troubleshooting

### Erro ao instalar shadcn/ui
```bash
# Certifique-se de ter Node.js 18+ instalado
node --version

# Limpe o cache e reinstale
rm -rf node_modules package-lock.json
npm install
```

### Componente não encontrado
```bash
# Verifique se o componente foi instalado
npx shadcn@latest add [nome-do-componente]
```

### Erro de importação de tipos
```typescript
// Use alias @ configurado no tsconfig.json
import { api } from '@/services/api';
import { User } from '@/types';
```

---

**Pronto para começar!** 🚀

Siga as etapas acima e consulte o `PLANO_IMPLEMENTACAO.md` para detalhes completos de cada página.

