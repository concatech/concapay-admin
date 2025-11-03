# 🗺️ Mapeamento Visual - Projeto Modelo → Concapay Admin

## 📊 Visão Geral da Conversão

```
projeto-modelo (React SPA)  →  concapay-admin (Next.js App Router)
├── src/App.tsx             →  src/app/(admin)/layout.tsx
├── components/pages/       →  src/app/(admin)/*/page.tsx
├── components/ui/          →  src/components/ui/ (shadcn/ui)
├── services/api.ts         →  src/services/api.ts
└── types/index.ts          →  src/types/index.ts
```

---

## 🎯 Mapeamento de Arquivos

### Layout e Navegação

| Projeto Modelo | Concapay Admin | Descrição |
|----------------|----------------|-----------|
| `App.tsx` | `app/(admin)/layout.tsx` | Layout principal com navegação |
| `AppSidebar.tsx` | `components/layout/AppSidebar.tsx` | Menu lateral |
| `AppHeader.tsx` | `components/layout/AppHeader.tsx` | Cabeçalho |

### Páginas

| Projeto Modelo | Concapay Admin | Rota |
|----------------|----------------|------|
| `components/pages/DashboardPage.tsx` | `app/(admin)/dashboard/page.tsx` | `/dashboard` |
| `components/pages/UsersPage.tsx` | `app/(admin)/users/page.tsx` | `/users` |
| `components/pages/UserDetailPage.tsx` | `app/(admin)/users/[id]/page.tsx` | `/users/[id]` |
| `components/pages/OrdersPage.tsx` | `app/(admin)/orders/page.tsx` | `/orders` |
| `components/pages/ContestsPage.tsx` | `app/(admin)/contests/page.tsx` | `/contests` |
| `components/pages/WebhooksPage.tsx` | `app/(admin)/webhooks/page.tsx` | `/webhooks` |

### Componentes Reutilizáveis

| Projeto Modelo | Concapay Admin | Uso |
|----------------|----------------|-----|
| `FilterSection.tsx` | `components/filters/FilterSection.tsx` | Container de filtros |
| `DateRangeFilter.tsx` | `components/filters/DateRangeFilter.tsx` | Filtro de período |
| `MultiSelectFilter.tsx` | `components/filters/MultiSelectFilter.tsx` | Multi-seleção |
| `StatusBadge.tsx` | `components/shared/StatusBadge.tsx` | Badge de status |
| `TablePagination.tsx` | `components/shared/TablePagination.tsx` | Paginação |

### Componentes UI (shadcn/ui)

| Componente | Uso no Projeto |
|------------|----------------|
| `button.tsx` | Todas as páginas (ações, filtros) |
| `card.tsx` | Dashboard, User Detail, info cards |
| `input.tsx` | Todos os filtros de busca |
| `table.tsx` | Users, Orders, Contests, Webhooks, Transactions |
| `dialog.tsx` | Contest approval/rejection |
| `badge.tsx` | Status indicators |
| `skeleton.tsx` | Loading states |
| `tabs.tsx` | User Detail (Transactions, Pending Funds) |
| `select.tsx` | Multi-select filters |
| `popover.tsx` | Date picker, filters |
| `calendar.tsx` | Date range selection |
| `textarea.tsx` | Admin notes in contests |
| `label.tsx` | Form labels |

---

## 🔄 Conversão de Padrões

### 1. Navegação

**Projeto Modelo (useState):**
```tsx
const [currentView, setCurrentView] = useState('dashboard');
setCurrentView('users'); // Navegar
```

**Concapay Admin (Next.js Router):**
```tsx
import { useRouter } from 'next/navigation';
const router = useRouter();
router.push('/users'); // Navegar
```

### 2. Componentes

**Projeto Modelo (Client Component):**
```tsx
// Tudo é client component no React SPA
export function DashboardPage() { ... }
```

**Concapay Admin (Server/Client Components):**
```tsx
// Server Component (padrão)
export default async function DashboardPage() { ... }

// Client Component (quando necessário)
'use client';
export function InteractiveComponent() { ... }
```

### 3. API Calls

**Projeto Modelo:**
```tsx
const data = await api.getDashboard();
```

**Concapay Admin (mesma interface):**
```tsx
const data = await api.getDashboard();
// Mas com autenticação real via cookies/headers
```

---

## 📐 Estrutura de Pastas Comparada

### Projeto Modelo (React SPA)
```
projeto-modelo/
└── src/
    ├── App.tsx
    ├── components/
    │   ├── AppSidebar.tsx
    │   ├── AppHeader.tsx
    │   ├── DateRangeFilter.tsx
    │   ├── FilterSection.tsx
    │   ├── MultiSelectFilter.tsx
    │   ├── StatusBadge.tsx
    │   ├── TablePagination.tsx
    │   ├── pages/
    │   │   ├── DashboardPage.tsx
    │   │   ├── UsersPage.tsx
    │   │   ├── UserDetailPage.tsx
    │   │   ├── OrdersPage.tsx
    │   │   ├── ContestsPage.tsx
    │   │   └── WebhooksPage.tsx
    │   └── ui/
    │       └── [48 shadcn components]
    ├── services/
    │   └── api.ts
    ├── types/
    │   └── index.ts
    └── main.tsx
```

### Concapay Admin (Next.js App Router)
```
concapay-admin/
└── src/
    ├── app/
    │   ├── (admin)/
    │   │   ├── layout.tsx            # Era: App.tsx + AppSidebar + AppHeader
    │   │   ├── dashboard/
    │   │   │   └── page.tsx          # Era: DashboardPage.tsx
    │   │   ├── users/
    │   │   │   ├── page.tsx          # Era: UsersPage.tsx
    │   │   │   └── [id]/
    │   │   │       └── page.tsx      # Era: UserDetailPage.tsx
    │   │   ├── orders/
    │   │   │   └── page.tsx          # Era: OrdersPage.tsx
    │   │   ├── contests/
    │   │   │   └── page.tsx          # Era: ContestsPage.tsx
    │   │   └── webhooks/
    │   │       └── page.tsx          # Era: WebhooksPage.tsx
    │   ├── login/
    │   │   └── page.tsx              # NOVO: Autenticação
    │   └── globals.css
    ├── components/
    │   ├── layout/
    │   │   ├── AppSidebar.tsx        # Mesma função
    │   │   └── AppHeader.tsx         # Mesma função
    │   ├── filters/
    │   │   ├── FilterSection.tsx     # Mesma função
    │   │   ├── DateRangeFilter.tsx   # Mesma função
    │   │   └── MultiSelectFilter.tsx # Mesma função
    │   ├── shared/
    │   │   ├── StatusBadge.tsx       # Mesma função
    │   │   └── TablePagination.tsx   # Mesma função
    │   └── ui/
    │       └── [48 shadcn components] # Mesmos componentes
    ├── services/
    │   ├── api.ts                    # Similar, mas com auth real
    │   └── auth.service.ts           # NOVO: Autenticação
    ├── types/
    │   └── index.ts                  # Mesmos tipos
    ├── lib/
    │   └── utils.ts                  # Utilitários (cn, formatters)
    └── hooks/
        └── useAuth.ts                # NOVO: Hook de auth
```

---

## 🎨 Componentes Visuais

### Dashboard - Cards de Métricas

```tsx
// Estrutura idêntica em ambos os projetos
const stats = [
  { title: 'GMV', value: formatCurrency(data.gmv), icon: TrendingUp },
  { title: 'Total de Vendas', value: data.total_orders, icon: ShoppingCart },
  { title: 'Usuários Ativos', value: data.active_users, icon: Users },
  { title: 'Comissões', value: formatCurrency(data.total_commission), icon: DollarSign },
  { title: 'Fundos Pendentes', value: formatCurrency(data.total_pending_funds), icon: Clock },
  { title: 'Contestações', value: data.pending_contests_count, icon: AlertTriangle },
];
```

### Filtros - Padrão Reutilizável

```tsx
// Padrão usado em todas as páginas de listagem
<FilterSection>
  <FilterGroup label="Email">
    <Input placeholder="Buscar..." value={email} onChange={...} />
  </FilterGroup>
  <FilterGroup label="Status">
    <MultiSelectFilter options={statusOptions} onSelectionChange={...} />
  </FilterGroup>
  <FilterGroup label="Período">
    <DateRangeFilter onDateChange={...} />
  </FilterGroup>
  <Button onClick={handleSearch}>
    <Search className="w-4 h-4 mr-2" />
    Buscar
  </Button>
</FilterSection>
```

### Tabelas - Estrutura Padrão

```tsx
// Padrão usado em todas as páginas de listagem
<Card>
  <CardHeader>
    <CardTitle>Lista de X ({totalItems})</CardTitle>
  </CardHeader>
  <CardContent className="p-0">
    {loading ? (
      <LoadingSkeleton />
    ) : (
      <>
        <Table>
          <TableHeader>...</TableHeader>
          <TableBody>...</TableBody>
        </Table>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </>
    )}
  </CardContent>
</Card>
```

---

## 🔐 Diferenças Principais

### 1. Autenticação
- **Modelo:** Tokens mockados, sem auth real
- **Concapay:** JWT + CSRF tokens, cookies httpOnly, middleware de proteção

### 2. Roteamento
- **Modelo:** Estado interno (useState), sem URL real
- **Concapay:** Next.js App Router, URLs reais, navegação com back/forward

### 3. Server vs Client
- **Modelo:** Tudo é client-side
- **Concapay:** Server Components por padrão, Client apenas quando necessário

### 4. API
- **Modelo:** Mock data
- **Concapay:** API real com headers de autenticação

---

## ✅ Checklist de Conversão

### Por Página

#### Dashboard
- [ ] Copiar estrutura de cards
- [ ] Adaptar chamada de API com auth
- [ ] Manter filtro de período
- [ ] Adicionar loading states

#### Users
- [ ] Copiar tabela de usuários
- [ ] Adicionar filtro de email
- [ ] Implementar navegação para detalhes (Next.js Link)
- [ ] Manter paginação

#### User Detail
- [ ] Copiar cards de saldo
- [ ] Implementar tabs (Transações + Fundos Pendentes)
- [ ] Adicionar botão "Voltar"
- [ ] Carregar dados do userId (params)

#### Orders
- [ ] Copiar tabela de vendas
- [ ] Adicionar todos os filtros
- [ ] Mostrar badge "Contestado"
- [ ] Manter paginação

#### Contests
- [ ] Copiar tabela de contestações
- [ ] Implementar dialog de aprovação/rejeição
- [ ] Adicionar validação de admin_notes
- [ ] Toast de sucesso/erro

#### Webhooks
- [ ] Copiar tabela de eventos
- [ ] Adicionar filtros
- [ ] Mostrar IDs do Mercado Pago
- [ ] Manter paginação

---

## 🚀 Próximos Passos

1. **Iniciar com Setup** (TODOs 1-5)
   - Instalar dependências
   - Configurar shadcn/ui
   - Criar estrutura de pastas

2. **Implementar Base** (TODOs 6-7)
   - Copiar componentes reutilizáveis
   - Criar layout com Sidebar + Header

3. **Converter Páginas** (TODOs 8-13)
   - Uma por vez, seguindo a ordem do plano
   - Testar cada página antes de prosseguir

4. **Adicionar Auth** (TODO 14)
   - Login page
   - Middleware de proteção
   - Gerenciamento de tokens

5. **Finalizar** (TODO 15)
   - Ajustar cores/tema
   - Responsividade
   - Testes finais

---

**Data:** 02/11/2025
**Status:** 📋 Planejamento Completo - Pronto para implementação

