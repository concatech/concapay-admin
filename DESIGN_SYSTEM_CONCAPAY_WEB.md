# Design System - Concapay

## 📋 Sumário Executivo

Este documento descreve o sistema de design do `concapay-admin` (herdado do projeto `concapay-web`): cores, tipografia, espaçamentos, componentes e padrões visuais. O design system já está aplicado no código — os tokens vivem em `tailwind.config.ts` e os componentes base em `src/components/ui/` (shadcn/ui customizado). Use este documento como referência de manutenção para manter novas telas consistentes.

---

## 🎨 Paleta de Cores

### Cores Principais (Brand Colors)

| Cor | Nome | Hex | Uso |
|-----|------|-----|-----|
| **Void** | `void` | `#070D27` | Cor principal escura (backgrounds escuros, textos principais) |
| **Void Light** | `voidLight` | `#20304C` | Cor secundária escura (botões primários, textos destacados) |
| **Opulent** | `opulent` | `#0250F4` | Azul escuro (destaques, links importantes) |
| **Azure** | `azure` | `#0692F2` | Azul médio (botões secundários, elementos interativos) |
| **Glitter** | `glitter` | `#43BCFF` | Azul claro (hover states, elementos decorativos) |
| **Frost** | `frost` | `#E3E8F4` | Azul muito claro (backgrounds, bordas suaves) |

### Escala de Cores (Primary Scale)

```javascript
primary: {
  50: "#E3E8F4",  // Frost (mais claro)
  100: "#43BCFF", // Glitter
  500: "#0692F2", // Azure
  700: "#0250F4", // Opulent
  900: "#070D27", // Void (mais escuro)
}
```

### Escala de Cores (Secondary Scale)

```javascript
secondary: {
  100: "#20304C", // Void Light
  500: "#8492a6", // Cinza médio
  700: "#273444", // Cinza escuro
}
```

### Cores de Uso Específico

| Contexto | Cor | Hex | Uso |
|----------|-----|-----|-----|
| **Background Principal** | `bg-void` | `#070D27` | Fundo da aplicação |
| **Background Secundário** | `bg-white` | `#FFFFFF` | Cards, containers |
| **Background Hover** | `bg-gray-100` | `#F3F4F6` | Estados hover |
| **Background Alternado** | `bg-[#f5f9fe]` | `#F5F9FE` | Linhas alternadas em tabelas |
| **Background Header Sidebar** | `bg-[#20304c]` | `#20304C` | Header do sidebar |
| **Background Botão Modo** | `bg-[#e3e8f4]` | `#E3E8F4` | Container dos botões de modo |
| **Background Badge Ativo** | `bg-[#b8ffd2]` | `#B8FFD2` | Badge de status ativo |
| **Background Badge Inativo** | `bg-[#ffc7c7]` | `#FFC7C7` | Badge de status inativo |
| **Background Badge Categoria** | `bg-[#d8e7ff]` | `#D8E7FF` | Badge de categoria |
| **Background Ícone Card** | `bg-[#dbeafe]` | `#DBEAFE` | Background dos ícones nos cards |
| **Texto Principal** | `text-[#20304c]` | `#20304C` | Textos principais |
| **Texto Secundário** | `text-gray-600` | `#4B5563` | Textos secundários |
| **Texto Muted** | `text-gray-500` | `#6B7280` | Textos desabilitados |
| **Texto Escuro** | `text-[#101828]` | `#101828` | Valores, números importantes |
| **Texto Cinza Médio** | `text-[#4a5565]` | `#4A5565` | Labels, descrições |
| **Borda Input Normal** | `border-[rgba(66,133,244,0.75)]` | `rgba(66,133,244,0.75)` | Borda padrão de inputs |
| **Borda Input Focus** | `border-[#4285f4]` | `#4285F4` | Borda em foco |
| **Borda Input Suave** | `border-[#c9dcfc]` | `#C9DCFC` | Borda alternativa |
| **Background Input Suave** | `bg-[#f4f9ff]` | `#F4F9FF` | Background de inputs |

### Cores de Status

| Status | Cor | Hex | Uso |
|--------|-----|-----|-----|
| **Sucesso/Ativo** | Verde claro | `#B8FFD2` | Badges de status ativo |
| **Erro/Inativo** | Vermelho claro | `#FFC7C7` | Badges de status inativo |
| **Erro Input** | Vermelho | `#EF4444` | Estados de erro em formulários |
| **Aviso** | Amarelo | `#FBBF24` | Avisos (se necessário) |

---

## 🔤 Tipografia

### Fonte Principal

**Família:** `Exo` (Google Fonts)
- **Carregamento:** via `next/font/google` em `src/app/layout.tsx` (variável CSS `--font-exo`, `display: swap`)
- **Pesos disponíveis:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

### Tamanhos Customizados (Tailwind)

| Tamanho | Classe Tailwind | Tamanho Real | Line Height | Letter Spacing | Uso |
|---------|----------------|--------------|-------------|-----------------|-----|
| `brand-xs` | `text-brand-xs` | 14px (0.875rem) | 1.5 | 0 | Textos pequenos, labels |
| `brand-sm` | `text-brand-sm` | 16px (1rem) | 1.5 | 0 | Textos padrão, parágrafos |
| `brand-md` | `text-brand-md` | 18px (1.125rem) | 1.5 | 0 | Textos médios, subtítulos |
| `brand-lg` | `text-brand-lg` | 20px (1.25rem) | 1.5 | 0 | Textos grandes, títulos secundários |
| `brand-xl` | `text-brand-xl` | 24px (1.5rem) | 1.4 | 0 | Títulos de seção |
| `brand-2xl` | `text-brand-2xl` | 32px (2rem) | 1.3 | 0 | Títulos principais |
| `brand-3xl` | `text-brand-3xl` | 40px (2.5rem) | 1.2 | 0 | Títulos grandes |
| `brand-4xl` | `text-brand-4xl` | 48px (3rem) | 1.2 | 0 | Títulos hero |
| `brand-5xl` | `text-brand-5xl` | 56px (3.5rem) | 1.2 | 0 | Títulos hero grandes |

### Pesos de Fonte

| Peso | Classe Tailwind | Valor | Uso |
|------|----------------|-------|-----|
| Regular | `font-regular` | 400 | Textos padrão |
| Medium | `font-medium` | 500 | Textos destacados |
| SemiBold | `font-semibold` | 600 | Títulos, labels importantes |
| Bold | `font-bold` | 700 | Títulos principais, destaques |

### Padrões de Uso

```css
/* Título Principal */
h1: text-2xl ou text-brand-xl, font-bold, text-[#20304c]

/* Título Secundário */
h2: text-xl ou text-brand-lg, font-semibold, text-[#20304c]

/* Subtítulo */
h3: text-lg ou text-brand-md, font-medium, text-[#20304c]

/* Texto Padrão */
p: text-base ou text-brand-sm, font-normal, text-[#20304c]

/* Texto Secundário */
p.secondary: text-sm, font-normal, text-gray-600

/* Labels */
label: text-base, font-normal, text-[#20304c]
```

---

## 📐 Espaçamentos

### Sistema de Espaçamento (Tailwind)

O projeto usa o sistema padrão do Tailwind com algumas extensões:

```javascript
spacing: {
  '8xl': '96rem',   // 1536px
  '9xl': '128rem',  // 2048px
}
```

### Padrões de Espaçamento

| Contexto | Espaçamento | Classe | Valor |
|----------|-------------|--------|-------|
| **Padding Cards** | `p-5` | 20px | Padding interno dos cards |
| **Padding Seções** | `p-4` | 16px | Padding de seções |
| **Padding Inputs** | `px-4 py-3` | 16px horizontal, 12px vertical | Inputs padrão |
| **Gap Cards Grid** | `gap-5` | 20px | Espaçamento entre cards |
| **Gap Botões** | `gap-4` | 16px | Espaçamento entre botões |
| **Gap Itens Menu** | `gap-2` | 8px | Espaçamento entre itens do menu |
| **Margin Bottom Seções** | `mb-6` | 24px | Espaço entre seções principais |
| **Padding Sidebar** | `px-[21px] py-6` | 21px horizontal, 24px vertical | Padding do sidebar |
| **Padding Menu Items** | `px-[10.5px] py-[7px]` | 10.5px horizontal, 7px vertical | Itens do menu |

---

## 🎭 Componentes

### Botões (Button)

Implementado em `src/components/ui/button.tsx` (shadcn/ui + cva).

#### Variantes

| Variante | Background | Texto | Hover |
|----------|------------|-------|-------|
| **default** | `bg-voidLight` (`#20304C`) | Branco | `bg-[#2a4165]` |
| **destructive** | `bg-destructive` | Branco | `bg-destructive/90` |
| **outline** | `bg-background` + borda | `text-foreground` | `bg-accent` |
| **secondary** | `bg-secondary` | `text-secondary-foreground` | `bg-secondary/80` |
| **ghost** | Transparente | herdado | `bg-accent` |
| **link** | Transparente | `text-primary` | underline |

#### Tamanhos

| Tamanho | Dimensões | Border Radius |
|---------|-----------|---------------|
| **sm** | `h-8 px-3 py-1.5` | `rounded-xl` |
| **default** | `h-9 px-4 py-2` | `rounded-xl` |
| **lg** | `h-10 px-8 py-3` | `rounded-2xl` |
| **icon** | `size-9` | `rounded-md` |

#### Exemplo de Uso

```tsx
import { Button } from "@/components/ui/button";

<Button>Cadastrar produto</Button>
<Button variant="destructive" size="lg">Excluir</Button>
```

### Inputs (Input)

#### Estilo Padrão

- **Background:** `bg-white` ou `bg-[#f4f9ff]`
- **Border:** `border-[#c9dcfc]` ou `border-[rgba(66,133,244,0.75)]`
- **Border Radius:** `rounded-lg`
- **Padding:** `px-4 py-3`
- **Font:** `font-['Exo',_sans-serif]`
- **Focus:** `focus:border-[#20304c] focus:ring-[#20304c]`

#### Estados

| Estado | Border | Background |
|--------|--------|------------|
| **Normal** | `border-[#c9dcfc]` | `bg-[#f4f9ff]` |
| **Focus** | `border-[#20304c]` | `bg-white` |
| **Error** | `border-red-300` | `bg-white` |
| **Disabled** | `border-gray-300` | `bg-gray-100` |

### Cards

Implementado em `src/components/ui/card.tsx` (componentes `Card`, `CardHeader`, `CardTitle`, `CardContent`).

#### Estilo Padrão (classes base do `Card`)

- **Background:** `bg-white`
- **Border Radius:** `rounded-xl`
- **Border:** `border`
- **Shadow:** `shadow` (padrão Tailwind)
- **Padding:** `p-5`

#### Exemplo

```tsx
import { Card, CardContent } from "@/components/ui/card";

<Card>
  <CardContent>{/* Conteúdo */}</CardContent>
</Card>
```

### Tabelas

#### Estilo do Header

- **Background:** `bg-blue-100`
- **Padding:** `px-6 py-3`
- **Font:** `text-base font-bold text-gray-900`

#### Estilo das Linhas

- **Linha Par:** `bg-[#f5f9fe]`
- **Linha Ímpar:** `bg-white`
- **Hover:** `hover:bg-muted/50` (padrão do `TableRow` em `src/components/ui/table.tsx`)
- **Padding:** `px-6 py-4`

#### Exemplo

Usar os componentes shadcn de `src/components/ui/table.tsx` (padrão aplicado em `src/app/(admin)/users/page.tsx`):

```tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow className="bg-blue-100">
      <TableHead className="text-base font-bold text-gray-900">Coluna</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow className="bg-[#f5f9fe]">
      <TableCell>Dados</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Badges

Implementado em `src/components/ui/badge.tsx` como variantes do componente `Badge` (ícones via `lucide-react` quando necessário):

| Variante | Background | Uso |
|----------|------------|-----|
| **active** | `bg-[#b8ffd2]` | Status ativo |
| **inactive** | `bg-[#ffc7c7]` | Status inativo/desativado |
| **category** | `bg-[#d8e7ff]` | Categoria |
| **default** | `bg-voidLight` | Destaque genérico |

```tsx
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

<Badge variant="active"><CheckCircle /> Ativo</Badge>
<Badge variant="inactive">Desativado</Badge>
<Badge variant="category">{category}</Badge>
```

> Nota: `src/components/shared/StatusBadge.tsx` (status de pedidos/contestações) usa deliberadamente outra escala de cores (`bg-green-500`, `bg-amber-500`, `destructive`) com ícones.

### Sidebar

#### Estilo Geral

- **Width:** `w-[224px]`
- **Background:** `bg-white`
- **Border:** `border-r border-gray-200`

#### Header do Sidebar

- **Height:** `h-[77px]`
- **Background:** `bg-[#20304c]`
- **Border Radius:** `rounded-bl-lg rounded-br-lg`
- **Padding:** `p-4`

#### Menu Items

- **Padding:** `px-[10.5px] py-[7px]`
- **Border Radius:** `rounded-[8.75px]`
- **Font:** `text-base font-medium`
- **Active:** `bg-[#e3e8f4] text-black`
- **Inactive:** `bg-[#fefefe] text-black hover:bg-gray-100`

### Header

Implementado em `src/components/layout/AppHeader.tsx` (toggle do menu + botão Sair).

#### Estilo Geral

- **Background:** `bg-white`
- **Shadow:** `shadow-sm`
- **Border:** `border-b border-gray-200`
- **Padding:** `px-4 py-3`

---

## 🎯 Border Radius

Neste projeto `--radius: 0.5rem` (definido em `src/app/globals.css`), então as classes resolvem para:

| Valor | Classe | Uso |
|-------|--------|-----|
| `8px` | `rounded-lg` (`var(--radius)`) | Inputs, elementos pequenos |
| `8.75px` | `rounded-[8.75px]` | Itens do menu do sidebar |
| `12px` | `rounded-xl` | Cards, botões (tamanhos sm/default) |
| `16px` | `rounded-2xl` | Botões grandes, elementos destacados |
| `32px` | `rounded-4xl` | Elementos muito grandes (custom em `tailwind.config.ts`) |

---

## 🌊 Animações

### Keyframes Customizados

```css
@keyframes slideInRight {
  0% { transform: translateX(100%); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
```

### Classes de Animação

- `animate-slide-in-right`: Slide da direita (0.3s ease-out)
- `animate-fade-in`: Fade in (0.3s ease-out)

---

## 📱 Layout e Grid

### Breakpoints (Tailwind Padrão)

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Grid de Cards

```tsx
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
  {/* Cards */}
</div>
```

### Layout Principal (Admin)

Definido em `src/app/(admin)/layout.tsx`:

- **Estrutura:** `flex h-screen` com `AppSidebar` fixo à esquerda e coluna `AppHeader` + `<main>` à direita
- **Main:** `flex-1 overflow-auto bg-background`
- **Responsivo:** sidebar vira overlay com backdrop abaixo de `md` (768px), controlado via `matchMedia`

---

## 🔍 Detalhes Visuais

### Shadows

- **Card:** `shadow` (padrão Tailwind)
- **Header:** `shadow-sm`
- **Hover:** Nenhuma shadow específica, apenas mudança de background

### Borders

- **Padrão:** `border-gray-200`
- **Inputs:** `border-[#c9dcfc]` ou `border-[rgba(66,133,244,0.75)]`
- **Inputs Focus:** `border-[#20304c]` ou `border-[#4285f4]`

### Opacidades

- **Textos Secundários:** `opacity-70`
- **Placeholders:** `placeholder-[#20304c] placeholder-opacity-70`

---

## 📝 Notas de Implementação

1. **Fonte Exo:** Carregada via `next/font/google` em `src/app/layout.tsx` (variável `--font-exo`)
2. **Cores Customizadas:** Muitas cores usam valores hex diretos (`text-[#20304c]`) em vez de classes do Tailwind
3. **Espaçamentos Específicos:** Alguns espaçamentos usam valores customizados (`px-[21px]`, `py-[7px]`)
4. **Consistência:** O design usa principalmente a paleta de cores definida, mas alguns elementos têm cores específicas inline

---

## 🎨 Exemplos de Uso

### Card de Estatística

Padrão usado em `src/app/(admin)/dashboard/page.tsx`, com o componente `Card` do shadcn (as classes base `bg-white rounded-xl border shadow p-5` vivem em `src/components/ui/card.tsx`) e ícones de `lucide-react`:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

<Card className="hover:shadow-lg transition-shadow">
  <CardHeader className="flex items-center justify-between">
    <CardTitle className="text-[#4a5565] text-base">Total de vendas</CardTitle>
    <div className="bg-[#dbeafe] p-2.5 rounded-lg">
      <TrendingUp className="text-black" />
    </div>
  </CardHeader>
  <CardContent>
    <p className="text-xl text-[#101828] font-normal">R$ 12.590,98</p>
  </CardContent>
</Card>
```

### Botão Primário

```tsx
<button className="bg-[#20304c] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#2a4165]">
  Cadastrar produto
</button>
```

### Input Padrão

```tsx
<input
  className="w-full px-4 py-3 border border-[#c9dcfc] bg-[#f4f9ff] rounded-lg shadow-sm placeholder-[#20304c] placeholder-opacity-70 focus:outline-none focus:ring-1 focus:ring-[#20304c] focus:border-[#20304c] text-base font-['Exo',_sans-serif]"
  placeholder="Digite..."
/>
```

---

**Última atualização:** 2026-08-17  
**Versão:** 1.1.0

