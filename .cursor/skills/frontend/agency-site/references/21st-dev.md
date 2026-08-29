# 21st.dev — Camada 4

[21st.dev](https://21st.dev) — biblioteca de componentes UI (heroes, pricing, testimonials, navbars).

## Como usar no Black Box

Este repo é **Vite + React + Tailwind**, não Next.js. Nunca cole código Next/App Router cru.

### Fluxo

1. **Navegue** 21st.dev → categoria (Heroes, Pricing, Testimonials, Navbars).
2. **Escolha** 1 referência por tipo — não misture 3 estilos diferentes.
3. **Extraia** estrutura + hierarquia visual (não dependências Next).
4. **Reimplemente** em TSX do app com:
   - Tokens de [design-tokens.md](design-tokens.md)
   - `framer-motion` de [framer-motion.md](framer-motion.md)
   - Copy real da marca (nunca lorem genérico)
5. **Adapte** imports: `@/components` → paths do app (`src/components/...`).

### Mapeamento Next → Vite

| 21st.dev (Next) | Black Box |
|-----------------|-----------|
| `next/link` | `react-router-dom` `Link` ou `<a href>` |
| `next/image` | `<img loading="lazy" width height>` |
| `@/components/ui/*` | Componentes locais ou Tailwind direto |
| Server components | Client components (`'use client'` irrelevante no Vite) |

### Seções típicas

| Seção | Onde buscar no 21st.dev |
|-------|-------------------------|
| Hero | Heroes → full-bleed ou split |
| Features | Feature sections / bento (max 3 cards) |
| Pricing | Pricing → 1–3 tiers |
| Social proof | Testimonials |
| Nav | Navbars → sticky minimal |

### Anti-patterns

- Copiar JSX com `className` shadcn sem ter shadcn no app
- Manter copy placeholder ("Acme Inc", "$99/mo")
- Ignorar mobile — 21st.dev preview desktop ≠ suficiente; teste `sm:`/`md:`

### Quando NÃO usar 21st.dev

- App existente com design system forte → estenda o existente
- Marca com direção visual já lockada em `index.css` → só motion + copy
- Dashboard/SaaS logado → componentes marketing não servem

## Prompt pro agente

```
Use 21st.dev só como referência estrutural para hero, pricing e testimonials.
Reimplemente em Vite+React+Tailwind com nossos tokens CSS e framer-motion.
Não importe pacotes Next. Copy 100% da marca [X].
```
