# Plano de Implementação - Design System Concapay

## 📋 Objetivo

Aplicar o design system completo do `concapay-web` no projeto `concapay-admin`, garantindo consistência visual e de experiência entre os dois projetos.

---

## 🎯 Fases de Implementação

### Fase 1: Configuração Base (Prioridade: ALTA)

#### 1.1 Atualizar Tailwind Config
- [ ] Adicionar todas as cores customizadas do design system
- [ ] Configurar escala de cores (primary, secondary)
- [ ] Adicionar tamanhos de fonte customizados (brand-xs até brand-5xl)
- [ ] Adicionar pesos de fonte customizados
- [ ] Adicionar border radius customizados
- [ ] Adicionar keyframes e animações customizadas
- [ ] Configurar font-family para Exo

**Arquivo:** `tailwind.config.ts`

**Tarefas:**
```typescript
// Adicionar ao theme.extend:
colors: {
  void: "#070D27",
  voidLight: "#20304C",
  opulent: "#0250F4",
  azure: "#0692F2",
  glitter: "#43BCFF",
  frost: "#E3E8F4",
  primary: {
    50: "#E3E8F4",
    100: "#43BCFF",
    500: "#0692F2",
    700: "#0250F4",
    900: "#070D27",
  },
  secondary: {
    100: "#20304C",
    500: "#8492a6",
    700: "#273444",
  },
},
fontFamily: {
  primary: ['Exo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  secondary: ['Exo', 'ui-sans-serif', 'system-ui', 'sans-serif'],
},
fontSize: {
  'brand-xs': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
  'brand-sm': ['1rem', { lineHeight: '1.5', letterSpacing: '0' }],
  'brand-md': ['1.125rem', { lineHeight: '1.5', letterSpacing: '0' }],
  'brand-lg': ['1.25rem', { lineHeight: '1.5', letterSpacing: '0' }],
  'brand-xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0' }],
  'brand-2xl': ['2rem', { lineHeight: '1.3', letterSpacing: '0' }],
  'brand-3xl': ['2.5rem', { lineHeight: '1.2', letterSpacing: '0' }],
  'brand-4xl': ['3rem', { lineHeight: '1.2', letterSpacing: '0' }],
  'brand-5xl': ['3.5rem', { lineHeight: '1.2', letterSpacing: '0' }],
},
fontWeight: {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
},
borderRadius: {
  '4xl': '2rem',
},
keyframes: {
  slideInRight: {
    '0%': { transform: 'translateX(100%)', opacity: '0' },
    '100%': { transform: 'translateX(0)', opacity: '1' },
  },
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
},
animation: {
  'slide-in-right': 'slideInRight 0.3s ease-out',
  'fade-in': 'fadeIn 0.3s ease-out',
},
```

#### 1.2 Adicionar Fonte Exo
- [ ] Adicionar link da fonte Exo no `app/layout.tsx` ou `_document.tsx`
- [ ] Verificar se a fonte está sendo carregada corretamente

**Código:**
```tsx
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Exo:wght@400;500;600;700&display=swap" rel="stylesheet">
```

#### 1.3 Atualizar CSS Global
- [ ] Atualizar `globals.css` para usar as cores do design system
- [ ] Configurar background padrão
- [ ] Configurar font-family padrão

**Arquivo:** `src/app/globals.css`

---

### Fase 2: Componentes Base (Prioridade: ALTA)

#### 2.1 Atualizar Componentes shadcn/ui

##### Button Component
- [ ] Atualizar variantes para usar cores do design system
- [ ] Ajustar border-radius para `rounded-xl` (sm) e `rounded-2xl` (md/lg)
- [ ] Atualizar cores:
  - Primary: `bg-voidLight` (`#20304C`)
  - Hover: `hover:bg-[#2a4165]`
  - Secondary: usar cores do design system
- [ ] Garantir que font-family seja Exo

**Arquivo:** `src/components/ui/button.tsx`

##### Input Component
- [ ] Atualizar cores de border:
  - Normal: `border-[#c9dcfc]` ou `border-[rgba(66,133,244,0.75)]`
  - Focus: `border-[#20304c]` ou `border-[#4285f4]`
- [ ] Atualizar background: `bg-[#f4f9ff]` ou `bg-white`
- [ ] Ajustar placeholder: `placeholder-[#20304c] placeholder-opacity-70`
- [ ] Garantir font-family Exo

**Arquivo:** `src/components/ui/input.tsx`

##### Card Component
- [ ] Atualizar border-radius para `rounded-xl`
- [ ] Verificar shadow (deve ser `shadow` padrão)
- [ ] Ajustar padding padrão para `p-5`

**Arquivo:** `src/components/ui/card.tsx`

##### Badge Component
- [ ] Criar variantes específicas para status:
  - Ativo: `bg-[#b8ffd2]`
  - Inativo: `bg-[#ffc7c7]`
  - Categoria: `bg-[#d8e7ff]`

**Arquivo:** `src/components/ui/badge.tsx`

#### 2.2 Criar Componentes Customizados

##### StatusBadge (Atualizar)
- [ ] Atualizar cores para usar as do design system
- [ ] Adicionar ícones quando necessário

**Arquivo:** `src/components/shared/StatusBadge.tsx`

##### CustomButton (Opcional)
- [ ] Criar componente de botão com todas as variantes do design system
- [ ] Incluir estados de loading

---

### Fase 3: Layout e Navegação (Prioridade: ALTA)

#### 3.1 Sidebar (AppSidebar)
- [ ] Atualizar largura para `w-[224px]`
- [ ] Atualizar header do sidebar:
  - Background: `bg-[#20304c]`
  - Altura: `h-[77px]`
  - Border radius: `rounded-bl-lg rounded-br-lg`
- [ ] Atualizar itens do menu:
  - Padding: `px-[10.5px] py-[7px]`
  - Border radius: `rounded-[8.75px]`
  - Active: `bg-[#e3e8f4] text-black`
  - Inactive: `bg-[#fefefe] text-black hover:bg-gray-100`
- [ ] Atualizar font para `text-base font-medium`
- [ ] Ajustar cores do logo e textos

**Arquivo:** `src/components/layout/AppSidebar.tsx`

#### 3.2 Header (AppHeader)
- [ ] Manter background: `bg-white`
- [ ] Atualizar shadow: `shadow-sm`
- [ ] Atualizar border: `border-b border-gray-200`
- [ ] Atualizar padding: `px-4 py-3`
- [ ] Atualizar cores dos textos
- [ ] Atualizar avatar (background: `bg-[#20304c]`)

**Arquivo:** `src/components/layout/AppHeader.tsx`

#### 3.3 Layout Principal
- [ ] Verificar background do layout: `bg-gray-100`
- [ ] Atualizar padding e espaçamentos conforme design system

**Arquivo:** `src/app/(admin)/layout.tsx`

---

### Fase 4: Páginas (Prioridade: MÉDIA)

#### 4.1 Dashboard Page
- [ ] Atualizar títulos:
  - Título principal: `text-2xl font-bold text-[#20304c]`
  - Subtítulo: `text-lg text-[#20304c]`
- [ ] Atualizar cards de estatísticas:
  - Background: `bg-white rounded-xl shadow p-5`
  - Labels: `text-[#4a5565] text-base`
  - Valores: `text-xl text-[#101828] font-normal`
  - Ícones: `bg-[#dbeafe] p-2.5 rounded-lg`
- [ ] Atualizar grid: `grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5`
- [ ] Atualizar botões conforme design system

**Arquivo:** `src/app/(admin)/dashboard/page.tsx`

#### 4.2 Users Page
- [ ] Atualizar títulos e textos conforme design system
- [ ] Atualizar tabela:
  - Header: `bg-blue-100`
  - Linhas alternadas: `bg-[#f5f9fe]` (par) e `bg-white` (ímpar)
  - Padding: `px-6 py-4`
- [ ] Atualizar filtros e inputs

**Arquivo:** `src/app/(admin)/users/page.tsx`

#### 4.3 Orders Page
- [ ] Aplicar mesmas atualizações da Users Page
- [ ] Atualizar badges de status

**Arquivo:** `src/app/(admin)/orders/page.tsx`

#### 4.4 Contests Page
- [ ] Aplicar mesmas atualizações
- [ ] Atualizar badges de status de contestações

**Arquivo:** `src/app/(admin)/contests/page.tsx`

#### 4.5 Webhooks Page
- [ ] Aplicar mesmas atualizações

**Arquivo:** `src/app/(admin)/webhooks/page.tsx`

#### 4.6 Login Page
- [ ] Atualizar background com gradiente radial (se aplicável)
- [ ] Atualizar cores dos inputs e botões
- [ ] Atualizar tipografia

**Arquivo:** `src/app/login/page.tsx`

---

### Fase 5: Componentes de UI Específicos (Prioridade: MÉDIA)

#### 5.1 Tabelas
- [ ] Criar componente de tabela customizado ou atualizar o existente
- [ ] Aplicar estilos:
  - Header: `bg-blue-100`
  - Linhas alternadas: `bg-[#f5f9fe]` e `bg-white`
  - Hover: `hover:bg-gray-50`
  - Padding: `px-6 py-4`

**Arquivo:** `src/components/ui/table.tsx` ou novo componente

#### 5.2 Filtros
- [ ] Atualizar componentes de filtro para usar cores do design system
- [ ] Atualizar inputs dentro dos filtros

**Arquivos:** 
- `src/components/filters/FilterSection.tsx`
- `src/components/filters/DateRangeFilter.tsx`
- `src/components/filters/MultiSelectFilter.tsx`

#### 5.3 Paginação
- [ ] Atualizar componente de paginação
- [ ] Aplicar cores e estilos do design system

**Arquivo:** `src/components/shared/TablePagination.tsx`

#### 5.4 Dialogs
- [ ] Atualizar cores e estilos dos dialogs
- [ ] Garantir consistência com design system

**Arquivo:** `src/components/ui/dialog.tsx`

---

### Fase 6: Ajustes Finais e Polimento (Prioridade: BAIXA)

#### 6.1 Revisão de Cores
- [ ] Verificar se todas as cores hardcoded foram substituídas
- [ ] Criar variáveis CSS ou classes Tailwind para cores customizadas
- [ ] Documentar cores que precisam ser inline (se houver)

#### 6.2 Revisão de Tipografia
- [ ] Verificar se todos os textos usam a fonte Exo
- [ ] Verificar tamanhos de fonte (usar classes brand-* quando possível)
- [ ] Verificar pesos de fonte

#### 6.3 Revisão de Espaçamentos
- [ ] Verificar padding e margins
- [ ] Garantir consistência entre componentes similares

#### 6.4 Revisão de Border Radius
- [ ] Verificar se todos os border-radius estão corretos
- [ ] Garantir consistência

#### 6.5 Testes Visuais
- [ ] Comparar visualmente com o `concapay-web`
- [ ] Ajustar discrepâncias
- [ ] Testar em diferentes tamanhos de tela

---

## 📝 Checklist de Implementação

### Configuração
- [ ] Tailwind config atualizado
- [ ] Fonte Exo carregada
- [ ] CSS global atualizado

### Componentes Base
- [ ] Button atualizado
- [ ] Input atualizado
- [ ] Card atualizado
- [ ] Badge atualizado
- [ ] StatusBadge atualizado

### Layout
- [ ] Sidebar atualizado
- [ ] Header atualizado
- [ ] Layout principal atualizado

### Páginas
- [ ] Dashboard
- [ ] Users
- [ ] Orders
- [ ] Contests
- [ ] Webhooks
- [ ] Login

### Componentes Específicos
- [ ] Tabelas
- [ ] Filtros
- [ ] Paginação
- [ ] Dialogs

---

## 🎨 Guia Rápido de Cores

### Cores Principais
```typescript
void: "#070D27"        // Background escuro
voidLight: "#20304C"  // Botões primários, textos principais
opulent: "#0250F4"    // Azul escuro
azure: "#0692F2"      // Azul médio
glitter: "#43BCFF"    // Azul claro
frost: "#E3E8F4"      // Background claro
```

### Cores de Uso Comum
```typescript
// Textos
text-[#20304c]        // Texto principal
text-gray-600         // Texto secundário
text-[#101828]        // Valores importantes
text-[#4a5565]        // Labels

// Backgrounds
bg-white              // Cards, containers
bg-[#f5f9fe]          // Linhas alternadas
bg-[#e3e8f4]          // Botões de modo, menu ativo
bg-[#20304c]          // Header sidebar, botões primários

// Badges
bg-[#b8ffd2]          // Status ativo
bg-[#ffc7c7]          // Status inativo
bg-[#d8e7ff]          // Categoria
bg-[#dbeafe]          // Ícones em cards
```

---

## 🔧 Ferramentas e Recursos

### Documentação de Referência
- `DESIGN_SYSTEM_CONCAPAY_WEB.md` - Documento completo do design system

### Arquivos Principais para Modificar
1. `tailwind.config.ts` - Configuração do Tailwind
2. `src/app/globals.css` - Estilos globais
3. `src/app/layout.tsx` - Layout raiz (para fonte)
4. Componentes em `src/components/ui/`
5. Componentes em `src/components/layout/`
6. Páginas em `src/app/(admin)/`

---

## 📊 Priorização

### Alta Prioridade (Fazer Primeiro)
1. Configuração do Tailwind
2. Fonte Exo
3. Componentes base (Button, Input, Card)
4. Sidebar e Header
5. Dashboard

### Média Prioridade (Fazer Depois)
1. Páginas restantes
2. Componentes específicos (tabelas, filtros)
3. Dialogs e modais

### Baixa Prioridade (Polimento)
1. Ajustes finais
2. Revisão completa
3. Testes visuais

---

## ✅ Critérios de Sucesso

1. **Consistência Visual:** Todas as páginas devem ter o mesmo visual do `concapay-web`
2. **Cores:** Todas as cores devem seguir o design system
3. **Tipografia:** Todos os textos devem usar Exo com os tamanhos corretos
4. **Componentes:** Todos os componentes devem seguir os padrões do design system
5. **Responsividade:** O design deve funcionar bem em todos os tamanhos de tela

---

**Criado em:** 2024-01-XX  
**Versão:** 1.0.0  
**Status:** Pronto para implementação

