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

