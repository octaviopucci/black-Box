---
name: agency-site
description: >-
  Landing Standard (simples) em projects/<slug>/. Para site top use /agency-premium.
  Next.js + shadcn + Framer. Kit premium e scaffold ficam aqui; execução Premium
  na skill agency-premium.
paths:
  - "projects/**/*.{tsx,jsx,css,ts,js,html}"
  - "apps/**/*.{tsx,jsx,css,ts,js,html}"
  - "portal/**/*.{tsx,jsx,css,ts,js,html}"
  - ".cursor/skills/frontend/agency-site/**/*"
---

# Agency Site — kit executável

Referência visual: [ARP Fibra](https://grupoarpfibra.com.br/).

**Premium → use `/agency-premium`** (skill dedicada: `.cursor/skills/frontend/agency-premium/SKILL.md`).

Este arquivo: tier **Standard** + documentação do kit premium.

---

## O kit já inclui (não recriar)

```
references/premium-kit/
├── site.config.ts              ← único arquivo de customização principal
├── globals.premium.css         ← tokens, grain, btn-shine, hero float, globe
└── src/
    ├── app/layout.tsx, page.tsx
    ├── lib/prefers-reduced-motion.ts
    └── components/
        ├── providers/smooth-scroll.tsx   (Lenis + GSAP)
        └── sections/
            navbar, hero, lifestyle-pinned, features, statement,
            about, pricing, benefits, support, faq, testimonials, footer
```

**13 seções** montadas em `page.tsx`. GSAP pin+scrub na lifestyle. Hero layered.
Framer stagger no hero. WhatsApp FAB.

---

## Tiers

| | **Standard** (`/agency-site`) | **Premium** (`/agency-premium`) |
|---|-------------|-------------|
| Ativação | `/agency-site landing …` | **`/agency-premium …`** |
| Entrega | Seção a seção (ok entre elas) | **Kit completo de uma vez** |
| Motion | Framer — [framer-motion.md](references/framer-motion.md) | Kit (GSAP+Lenis+Framer) |
| Scaffold | create-next-app manual | **`scaffold-premium.sh`** |

Inferir Premium → redirecionar usuário para **`/agency-premium`**.

---

## Standard (pedidos simples)

Sem `premium` no pedido:

```bash
npx create-next-app@latest projects/<slug> --typescript --tailwind --eslint \
  --app --src-dir --import-alias "@/*" --turbopack --yes
cd projects/<slug> && npx shadcn@latest init -y && npm install framer-motion
```

7 seções essenciais — [initial-prompt.md](references/initial-prompt.md).
Pode pedir ok entre seções.

---

## Customização pós-scaffold

| Prioridade | Arquivo | O quê |
|------------|---------|-------|
| 1 | `src/site.config.ts` | Toda copy, links, pricing, FAQ, contato |
| 2 | `public/hero.webp` | Visual hero (substitui placeholder) |
| 3 | `public/about.webp` | Foto about |
| 4 | `globals.premium.css` | Cores `--color-accent` se marca exigir |
| 5 | Seções individuais | Só se pedido explícito de redesign |

21st.dev é **opcional** — não bloqueia entrega Premium.

---

## Contexto — inferir, não perguntar

| Campo | Fallback |
|-------|----------|
| slug | kebab-case da marca |
| name | do pedido |
| whatsapp | placeholder + TODO no config |
| nicho | genérico até usuário refinar |

---

## Performance (Premium)

- `npm run build` verde antes de responder
- `prefers-reduced-motion` já no kit
- `ScrollTrigger.refresh()` no SmoothScrollProvider
- Imagens reais → `next/image` quando adicionar assets

---

## Comandos

```bash
# Premium — criar projeto
bash .cursor/skills/frontend/agency-site/scripts/scaffold-premium.sh <slug>

# Dev
cd projects/<slug> && npm run dev

# Build
cd projects/<slug> && npm run build
```

---

## iPhone

Use **`/agency-premium`** — ver skill dedicada e [mobile-iphone.md](../../vibe-coding/references/mobile-iphone.md).

## Referências

- Motion patterns: [premium-motion.md](references/premium-motion.md)
- Composição: [premium-composition.md](references/premium-composition.md)
- Erros: [errors.md](references/errors.md)
- Design: [design-tokens.md](references/design-tokens.md) + `anti-ai-landing`
