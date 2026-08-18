# Concapay Admin

Painel administrativo da Concapay: gestão de usuários, pedidos, contestações, webhooks e reconciliações, com dashboard de métricas de vendas.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, diretório `src/`) + React 19 + TypeScript
- [Tailwind CSS 3](https://tailwindcss.com) com tokens customizados da marca (ver [Design System](DESIGN_SYSTEM_CONCAPAY_WEB.md))
- [shadcn/ui](https://ui.shadcn.com) (componentes em `src/components/ui/`)
- [TanStack React Query](https://tanstack.com/query) para dados da API (hooks em `src/hooks/`)
- Fonte [Exo](https://fonts.google.com/specimen/Exo) via `next/font/google`
- `lucide-react` (ícones), `sonner` (toasts), `date-fns` (datas)

## Como rodar

```bash
npm install
npm run dev
```

O app sobe em [http://localhost:3000](http://localhost:3000).

### Configuração da API

A URL base da API é lida de `NEXT_PUBLIC_API_BASE_URL` (ver `src/config/api.ts`). Sem a variável, o fallback é a API de produção (`https://concapay-back.fly.dev/api/v1`). Para apontar para outro backend, crie um `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

### Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Serve o build de produção |
| `npm run lint` | ESLint |

## Estrutura

```
src/
├── app/
│   ├── (admin)/          # Rotas autenticadas: dashboard, users, users/[id],
│   │                     # orders, contests, webhooks, reconciliations
│   ├── login/            # Tela de login
│   └── page.tsx          # Redirect raiz (autenticado → /dashboard, senão → /login)
├── components/
│   ├── ui/               # Componentes base (shadcn/ui customizado)
│   ├── layout/           # AppSidebar, AppHeader
│   ├── filters/          # FilterSection, DateRangeFilter, MultiSelectFilter
│   ├── shared/           # StatusBadge, TablePagination
│   └── ProtectedRoute.tsx
├── config/               # API_BASE_URL
├── hooks/                # useAuth + hooks React Query por recurso
├── lib/                  # utils (cn, formatadores), query-client, api-error-handler
├── services/             # api.ts (endpoints admin), auth.service.ts
└── types/                # Tipos da API (paginação, User, Order, etc.)
```

## Autenticação

O login (`/login`) usa o `auth.service.ts`, que guarda `auth_token` e `csrf_token` no `localStorage`. As rotas do grupo `(admin)` são protegidas no cliente pelo componente `ProtectedRoute`; respostas 401 da API redirecionam para o login.

## Design System

O visual segue o design system da Concapay (paleta void/voidLight/azure, tipografia Exo, padrões de cards, tabelas e badges), documentado em [DESIGN_SYSTEM_CONCAPAY_WEB.md](DESIGN_SYSTEM_CONCAPAY_WEB.md) e implementado em `tailwind.config.ts` + `src/components/ui/`.
