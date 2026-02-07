# Design System - Concapay Web

## 📋 Sumário Executivo

Este documento descreve o sistema de design completo do projeto `concapay-web`, incluindo cores, tipografia, espaçamentos, componentes e padrões visuais. Este design system será usado como referência para aplicar o mesmo visual no projeto `concapay-admin`.

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
- **URL:** `https://fonts.googleapis.com/css2?family=Exo:wght@400;500;600;700&display=swap`
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

#### Variantes

| Variante | Background | Texto | Hover | Border Radius |
|----------|------------|-------|-------|---------------|
| **Primary** | `#20304C` | Branco | `#2a4165` | `rounded-xl` (sm) ou `rounded-2xl` (md/lg) |
| **Secondary** | `#6B7280` | Branco | `#4B5563` | `rounded-2xl` |
| **Danger** | `#DC2626` | Branco | `#B91C1C` | `rounded-2xl` |
| **Ghost** | Transparente | `#20304C` | `bg-gray-100` | `rounded-md` ou `rounded-lg` |

#### Tamanhos

| Tamanho | Padding | Font Size | Border Radius |
|---------|---------|-----------|---------------|
| **Small** | `px-3 py-1.5` | `text-sm` | `rounded-xl` |
| **Medium** | `px-6 py-2` | `text-base` | `rounded-2xl` |
| **Large** | `px-8 py-3` | `text-lg` | `rounded-2xl` |

#### Exemplo de Uso

```tsx
<Button 
  variant="primary" 
  size="md"
  className="bg-[#20304c] text-white rounded-lg px-4 py-2"
>
  Cadastrar produto
</Button>
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

#### Estilo Padrão

- **Background:** `bg-white`
- **Border Radius:** `rounded-xl`
- **Shadow:** `shadow` (padrão Tailwind)
- **Padding:** `p-5`

#### Exemplo

```tsx
<div className="bg-white rounded-xl shadow p-5">
  {/* Conteúdo */}
</div>
```

### Tabelas

#### Estilo do Header

- **Background:** `bg-blue-100`
- **Padding:** `px-6 py-3`
- **Font:** `text-base font-bold text-gray-900`

#### Estilo das Linhas

- **Linha Par:** `bg-[#f5f9fe]`
- **Linha Ímpar:** `bg-white`
- **Hover:** `hover:bg-gray-50`
- **Padding:** `px-6 py-4`

#### Exemplo

```tsx
<table className="min-w-full divide-y divide-gray-200">
  <thead className="bg-blue-100">
    <tr>
      <th className="px-6 py-3 text-left text-base font-bold text-gray-900">
        Coluna
      </th>
    </tr>
  </thead>
  <tbody className="bg-white divide-y divide-gray-200">
    <tr className="bg-[#f5f9fe] hover:bg-gray-50">
      <td className="px-6 py-4">Dados</td>
    </tr>
  </tbody>
</table>
```

### Badges

#### Badge de Status Ativo

```tsx
<div className="flex items-center gap-1 bg-[#b8ffd2] text-gray-900 px-2 py-1 rounded-full w-fit">
  <span className="text-sm font-medium">Ativo</span>
  <CheckCircleIcon fontSize="small" />
</div>
```

#### Badge de Status Inativo

```tsx
<div className="flex items-center gap-1 bg-[#ffc7c7] text-gray-900 px-2 py-1 rounded-full w-fit">
  <span className="text-sm font-medium">Desativado</span>
  <CancelIcon fontSize="small" />
</div>
```

#### Badge de Categoria

```tsx
<div className="bg-[#d8e7ff] text-gray-900 px-2 py-1 rounded-lg w-fit">
  {category}
</div>
```

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

#### Estilo Geral

- **Background:** `bg-white`
- **Shadow:** `shadow-sm`
- **Border:** `border-b border-gray-200`
- **Padding:** `px-4 py-3`

#### Botões de Modo

- **Container:** `bg-[#e3e8f4] border-0 border-[#d9ecff] rounded-[8px] p-[4px]`
- **Botão Ativo:** `bg-[#20304c] text-white`
- **Botão Inativo:** `bg-[#e3e8f4] text-[#20304c]`
- **Padding:** `px-[14px] py-[8px]`
- **Font:** `font-['Exo:SemiBold'] font-semibold text-[14px]`

---

## 🎯 Border Radius

### Valores Customizados

| Valor | Classe | Uso |
|-------|--------|-----|
| `8px` | `rounded-[8px]` | Botões de modo, elementos pequenos |
| `8.75px` | `rounded-[8.75px]` | Itens do menu |
| `12px` | `rounded-lg` | Botões, inputs, cards médios |
| `16px` | `rounded-xl` | Cards, botões pequenos |
| `24px` | `rounded-2xl` | Botões grandes, elementos destacados |
| `32px` | `rounded-4xl` | Elementos muito grandes |

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

### Container Principal

- **Max Width:** `max-w-7xl` (1280px)
- **Padding:** `px-4 sm:px-6 lg:px-8`
- **Background:** `bg-gray-100` (layout principal)

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

1. **Fonte Exo:** Deve ser carregada via Google Fonts no `index.html`
2. **Cores Customizadas:** Muitas cores usam valores hex diretos (`text-[#20304c]`) em vez de classes do Tailwind
3. **Espaçamentos Específicos:** Alguns espaçamentos usam valores customizados (`px-[21px]`, `py-[7px]`)
4. **Consistência:** O design usa principalmente a paleta de cores definida, mas alguns elementos têm cores específicas inline

---

## 🎨 Exemplos de Uso

### Card de Estatística

```tsx
<div className="bg-white rounded-xl shadow p-5">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-[#4a5565] text-base">Total de vendas</p>
      <p className="text-xl text-[#101828] font-normal">R$ 12.590,98</p>
    </div>
    <div className="bg-[#dbeafe] p-2.5 rounded-lg">
      <TrendingUpIcon htmlColor="black"/>
    </div>
  </div>
</div>
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

**Última atualização:** 2024-01-XX  
**Versão:** 1.0.0

