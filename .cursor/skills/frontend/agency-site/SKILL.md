---
name: agency-site
description: >-
  Landing/site premium pronta para executar: kit completo em references/premium-kit/
  + script scaffold-premium.sh. Ao invocar /agency-site premium, RODAR scaffold,
  customizar site.config.ts, build verde — sem brainstorm, sem perguntas extras.
  Next.js + GSAP/Lenis + hero layered + pin/scrub. Standard tier para pedidos simples.
paths:
  - "projects/**/*.{tsx,jsx,css,ts,js,html}"
  - "apps/**/*.{tsx,jsx,css,ts,js,html}"
  - "portal/**/*.{tsx,jsx,css,ts,js,html}"
  - ".cursor/skills/frontend/agency-site/**/*"
---

# Agency Site — kit executável

Referência visual: [ARP Fibra](https://grupoarpfibra.com.br/).

**Premium = copiar kit + customizar config + build.** Não inventar do zero.

---

## Regra zero — `/agency-site premium` (override vibe-coding)

Quando o pedido contém **`premium`**, **`/agency-site premium`**, referência ARP,
ou “site top / cinematic”:

| Proibido | Obrigatório |
|----------|-------------|
| Brainstorm / plano / perguntas | **Executar na 1ª resposta** |
| Esperar ok entre seções | Entregar landing **completa** do kit |
| Só listar o que faria | `scaffold-premium.sh` + editar `site.config.ts` |
| Bloquear por falta de assets | Placeholders do kit + indicar `public/*.webp` |

**Só perguntar** se não der para inferir **nem marca nem slug**.

### Sequência (copiar e colar)

```bash
bash .cursor/skills/frontend/agency-site/scripts/scaffold-premium.sh <slug>
```

1. Editar `projects/<slug>/src/site.config.ts` (copy, WhatsApp, planos, FAQ)
2. `cd projects/<slug> && npm run build` — corrigir até verde
3. Responder com path, comandos dev, o que falta customizar

Runbook completo: [premium-runbook.md](references/premium-runbook.md)

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

| | **Standard** | **Premium** |
|---|-------------|-------------|
| Ativação | `/agency-site landing …` | `/agency-site premium …` |
| Entrega | Seção a seção (ok entre elas) | **Kit completo de uma vez** |
| Motion | Framer — [framer-motion.md](references/framer-motion.md) | Kit (GSAP+Lenis+Framer) |
| Scaffold | create-next-app manual | **`scaffold-premium.sh`** |

Inferir Premium se: “moderno”, “premium”, “ARP”, “cinematic”.

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

```
/agency-site premium [MARCA] — [nicho], WhatsApp [n], slug [cliente-x]
```

Agente **executa scaffold** — não devolve questionário.

---

## Checklist Premium (antes de responder)

- [ ] `projects/<slug>/` existe e `npm run build` verde
- [ ] `site.config.ts` customizado com dados do pedido
- [ ] Usuário sabe rodar `npm run dev`
- [ ] Assets opcionais listados (`public/hero.webp`)
- [ ] Não pediu ok para “próxima seção”

## Referências

- Motion patterns: [premium-motion.md](references/premium-motion.md)
- Composição: [premium-composition.md](references/premium-composition.md)
- Erros: [errors.md](references/errors.md)
- Design: [design-tokens.md](references/design-tokens.md) + `anti-ai-landing`
