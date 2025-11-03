# Plano de Implementação - Painel Admin Concapay

## 📋 Visão Geral

Este documento detalha o plano completo para implementar o painel administrativo do Concapay usando Next.js, React e Tailwind CSS, baseado no projeto-modelo do Figma.

---

## 🗂️ Estrutura do Projeto

```
concapay-admin/
├── src/
│   ├── app/
│   │   ├── (admin)/
│   │   │   ├── layout.tsx              # Layout com Sidebar + Header
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx            # Dashboard principal
│   │   │   ├── users/
│   │   │   │   ├── page.tsx            # Listagem de usuários
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx        # Detalhes do usuário
│   │   │   ├── orders/
│   │   │   │   └── page.tsx            # Listagem de vendas
│   │   │   ├── contests/
│   │   │   │   └── page.tsx            # Contestações
│   │   │   └── webhooks/
│   │   │       └── page.tsx            # Webhooks
│   │   ├── login/
│   │   │   └── page.tsx                # Página de login
│   │   ├── layout.tsx                  # Layout raiz
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                         # Componentes shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── table.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── select.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── label.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── AppSidebar.tsx          # Menu lateral
│   │   │   └── AppHeader.tsx           # Cabeçalho
│   │   ├── filters/
│   │   │   ├── FilterSection.tsx       # Container de filtros
│   │   │   ├── DateRangeFilter.tsx     # Filtro de período
│   │   │   └── MultiSelectFilter.tsx   # Filtro multi-seleção
│   │   ├── shared/
│   │   │   ├── StatusBadge.tsx         # Badge de status
│   │   │   ├── TablePagination.tsx     # Paginação de tabelas
│   │   │   └── LoadingSkeleton.tsx     # Skeletons de carregamento
│   │   └── pages/
│   │       ├── DashboardCards.tsx      # Cards do dashboard
│   │       ├── UserBalanceCards.tsx    # Cards de saldo do usuário
│   │       ├── ContestDialog.tsx       # Dialog de contestação
│   │       └── ...
│   ├── services/
│   │   ├── api.ts                      # Cliente API principal
│   │   └── auth.service.ts             # Serviço de autenticação
│   ├── types/
│   │   ├── index.ts                    # Tipos principais
│   │   ├── api.types.ts                # Tipos de API
│   │   └── ...
│   ├── lib/
│   │   ├── utils.ts                    # Utilitários (cn, formatters)
│   │   └── constants.ts                # Constantes da aplicação
│   └── hooks/
│       ├── useAuth.ts                  # Hook de autenticação
│       └── useApi.ts                   # Hook para chamadas API
├── public/
│   └── logo-concapay.png
├── components.json                     # Config shadcn/ui
├── tailwind.config.ts
└── next.config.ts
```

---

## 🎯 Mapeamento de Páginas e Endpoints

### 1. **Dashboard Page** (`/dashboard`)

**Endpoint:** `GET /api/v1/admin/dashboard`

**Dados exibidos:**
- **GMV** (Gross Merchandise Value) - Valor bruto total de vendas
- **Total de Vendas** - Número de pedidos processados
- **Usuários Ativos** - Usuários com vendas aprovadas nos últimos 30 dias
- **Comissões Totais** - Comissões acumuladas
- **Fundos Pendentes** - Valores bloqueados aguardando liberação (8 dias)
- **Contestações Pendentes** - Número de solicitações de cancelamento
- **Valor Contestado** - Valor total em contestação

**Filtros:**
- Período (data início/fim)

**Componentes do projeto-modelo:**
- `DashboardPage.tsx`

---

### 2. **Users Page** (`/users`)

**Endpoint:** `GET /api/v1/admin/users`

**Parâmetros de filtro:**
- `email` - Buscar por email
- `is_admin` - Filtrar por tipo de usuário

**Dados exibidos:**
- ID, Nome, Email, Tipo (Admin/Usuário), Data de cadastro

**Ações:**
- Ver detalhes do usuário (navega para `/users/[id]`)

**Componentes do projeto-modelo:**
- `UsersPage.tsx`

---

### 3. **User Detail Page** (`/users/[id]`)

**Endpoints:**
- `GET /api/v1/admin/users/{id}/balance` - Saldo do usuário
- `GET /api/v1/admin/users/{id}/transactions` - Transações
- `GET /api/v1/admin/users/{id}/pending-funds` - Fundos pendentes

**Abas:**

#### Aba 1: Saldo (Cards no topo)
- Saldo Disponível
- Saldo Pendente (bloqueado por 8 dias)
- Saldo Contestado
- Saldo Total

#### Aba 2: Transações
Tipos de transação:
- `commission_deduction` - Dedução de Comissão
- `funds_pending` - Fundos Pendentes
- `funds_released` - Fundos Liberados
- `withdrawal` - Saque
- `commission_reversal` - Reversão de Comissão
- `fund_cancellation` - Cancelamento de Fundos
- `balance_adjustment` - Ajuste de Saldo
- `contest_approval` - Aprovação de Contestação

**Colunas:** Data, Tipo, Descrição, Pedido, Valor

#### Aba 3: Fundos Pendentes
Status dos fundos:
- `pending` - Aguardando liberação
- `released` - Liberado
- `cancelled` - Cancelado/Reembolsado
- `contested` - Em contestação

**Colunas:** Pedido, Status, Data de Criação, Data de Liberação, Tempo Restante, Valor

**Componentes do projeto-modelo:**
- `UserDetailPage.tsx`

---

### 4. **Orders Page** (`/orders`)

**Endpoint:** `GET /api/v1/admin/orders`

**Parâmetros de filtro:**
- `status` - Status do pedido (paid, pending, refunded, expired)
- `payment_method` - Método de pagamento (pix, credit_card, boleto)
- `buyer_email` - Email do comprador
- `user_id` - ID do vendedor
- `product_id` - ID do produto
- `inserted_at_start` - Data de início
- `inserted_at_end` - Data de fim

**Dados exibidos:**
- Data, Comprador, Produto (nome + segmento), Vendedor (nome + email), Valor, Método de Pagamento, Status, Contestado (sim/não)

**Componentes do projeto-modelo:**
- `OrdersPage.tsx`

---

### 5. **Contests Page** (`/contests`)

**Endpoints:**
- `GET /api/v1/admin/contests` - Listar contestações
- `GET /api/v1/admin/contests/{id}` - Detalhes da contestação
- `POST /api/v1/admin/contests/{id}/approve` - Aprovar contestação
  ```json
  { "admin_notes": "string", "status": "approved" }
  ```
- `POST /api/v1/admin/contests/{id}/reject` - Rejeitar contestação
  ```json
  { "admin_notes": "string", "status": "rejected" }
  ```

**Parâmetros de filtro:**
- `status` - Status da contestação (pending, approved, rejected)
- `user_id` - ID do usuário

**Status:**
- `pending` - Sob revisão do admin
- `approved` - Contestação aprovada (fundos devolvidos ao comprador)
- `rejected` - Contestação rejeitada (fundos permanecem com o vendedor)

**Dados exibidos:**
- Data, Usuário (nome + email), Motivo, Valor, Status

**Ações:**
- Ver detalhes (Dialog)
- Aprovar (apenas pendentes)
- Rejeitar (apenas pendentes)

**Dialog de Contestação:**
- Comprador (nome + email)
- Valor
- Data da Contestação
- Status
- Motivo da Contestação
- ID do Pedido
- Observações do Admin (textarea obrigatória para aprovar/rejeitar)

**Componentes do projeto-modelo:**
- `ContestsPage.tsx`

---

### 6. **Webhooks Page** (`/webhooks`)

**Endpoints:**
- `GET /api/v1/webhooks/events` - Listar eventos
- `GET /api/v1/webhooks/orders/{id}/events` - Eventos de um pedido específico

**Parâmetros de filtro:**
- `action` - Ação do evento
- `status` - Status (processed, action_required, failed)
- `event_type` - Tipo de evento (order, payment, unknown)
- `mercado_pago_order_id` - ID do pedido no Mercado Pago

**Tipos de evento:**
- `order` - Relacionados ao ciclo de vida do pedido
- `payment` - Relacionados ao processamento de pagamentos
- `unknown` - Tipo não reconhecido

**Dados exibidos:**
- Recebido em, Processado em, Ação, Tipo, Status, Valor, ID Mercado Pago (Order + Payment), Oferta

**Componentes do projeto-modelo:**
- `WebhooksPage.tsx`

---

## 🔐 Autenticação

**Endpoints necessários:**
- Login (obtém JWT + CSRF token)
- Refresh token

**Headers obrigatórios para todas as requisições:**
```typescript
{
  'accept': 'application/json',
  'Authorization': 'Bearer {JWT_TOKEN}',
  'x-csrf-token': '{CSRF_TOKEN}'
}
```

**Implementação:**
- Middleware do Next.js para proteger rotas `/admin/*`
- Armazenar tokens em cookies httpOnly (seguro)
- Hook `useAuth` para gerenciar estado de autenticação
- Redirecionamento automático para `/login` se não autenticado

---

## 🎨 Componentes Reutilizáveis

### 1. **FilterSection**
Container para agrupar filtros com layout responsivo.

### 2. **DateRangeFilter**
Seletor de período com calendário (usa `react-day-picker` + `date-fns`).

### 3. **MultiSelectFilter**
Dropdown multi-seleção para filtros (usa Popover + Command do shadcn/ui).

### 4. **StatusBadge**
Badge colorido baseado no status (ordem, contestação, fundo, webhook).

```typescript
type BadgeType = 'order' | 'contest' | 'fund' | 'webhook';
```

**Cores:**
- Order: paid (verde), pending (amarelo), refunded (vermelho), expired (cinza)
- Contest: pending (amarelo), approved (verde), rejected (vermelho)
- Fund: pending (laranja), released (verde), cancelled (vermelho), contested (amarelo)
- Webhook: processed (verde), action_required (amarelo), failed (vermelho)

### 5. **TablePagination**
Controles de paginação + seletor de itens por página (25, 50, 100).

---

## 📦 Dependências Principais

```json
{
  "dependencies": {
    "next": "16.0.1",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "@radix-ui/react-*": "latest",  // Base do shadcn/ui
    "lucide-react": "latest",        // Ícones
    "date-fns": "latest",            // Manipulação de datas
    "sonner": "latest",              // Sistema de toasts
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest"
  }
}
```

---

## 🎨 Design System

### Cores Principais
```css
:root {
  --primary: 222.2 47.4% 11.2%;      /* Azul escuro */
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;      /* Vermelho */
  --border: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
}
```

### Ícones do Menu
- Dashboard: `Home`
- Usuários: `Users`
- Vendas: `ShoppingCart`
- Contestações: `AlertTriangle`
- Webhooks: `Webhook`

---

## 🔧 Utilitários

### Formatadores

```typescript
// lib/utils.ts

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

---

## 📝 Ordem de Implementação

### Fase 1: Setup (TODOs 1-5)
1. ✅ Instalar dependências (shadcn/ui, lucide-react, date-fns, sonner)
2. ✅ Configurar estrutura de pastas
3. ✅ Criar tipos TypeScript
4. ✅ Implementar serviço de API
5. ✅ Instalar componentes base do shadcn/ui

### Fase 2: Componentes Base (TODOs 6-7)
6. ✅ Criar componentes reutilizáveis (Filtros, StatusBadge, Pagination)
7. ✅ Implementar Layout (Sidebar + Header)

### Fase 3: Páginas (TODOs 8-13)
8. ✅ Dashboard Page
9. ✅ Users Page
10. ✅ User Detail Page
11. ✅ Orders Page
12. ✅ Contests Page
13. ✅ Webhooks Page

### Fase 4: Finalização (TODOs 14-15)
14. ✅ Sistema de autenticação
15. ✅ Ajustes de tema e estilo

---

## 🧪 Notas de Implementação

### Next.js App Router
- Usar **Server Components** quando possível (melhor performance)
- Usar **Client Components** (`'use client'`) apenas quando necessário:
  - Componentes com estado (useState, useEffect)
  - Componentes com eventos (onClick, onChange)
  - Hooks customizados

### Tratamento de Erros
- Implementar boundary de erro em cada página
- Toasts para feedback de ações (sucesso/erro)
- Skeleton loaders durante carregamento

### Performance
- Lazy loading de componentes pesados
- Memoização de componentes com `React.memo`
- Debounce em campos de busca

### Acessibilidade
- Labels em todos os inputs
- ARIA labels em botões de ação
- Navegação por teclado (Tab, Enter, Esc)

---

## 📚 Referências

- **API Base URL:** `https://concapay-back.fly.dev/api/v1`
- **Projeto Modelo:** `/Users/lucasalmeida/Documents/projetos/concapay/projeto-modelo`
- **shadcn/ui:** https://ui.shadcn.com/
- **Next.js 15 Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## ✅ Checklist Final

- [ ] Todas as páginas implementadas
- [ ] Todos os endpoints integrados
- [ ] Autenticação funcionando
- [ ] Filtros e paginação operacionais
- [ ] Responsividade em mobile/tablet
- [ ] Loading states e error handling
- [ ] Toasts para feedback
- [ ] Acessibilidade (WCAG 2.1 AA)
- [ ] Testes básicos
- [ ] Deploy em produção

---

**Última atualização:** 02/11/2025

