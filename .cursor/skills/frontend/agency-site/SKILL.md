---
name: agency-site
description: >-
  Setup de 4 camadas para landing/site/SaaS com cara de agência: Cloud Agent +
  Next.js App Router + motion (Framer + GSAP/Lenis no tier Premium) + design
  tokens + 21st.dev/shadcn. Projetos em projects/<slug>/ — standalone. Tier
  Premium = nível ARP Fibra (hero layered, pin+scrub, parallax). Use /agency-site.
  Integra vibe-coding + anti-ai-landing + scroll-cinematic. iPhone ok.
paths:
  - "projects/**/*.{tsx,jsx,css,ts,js,html}"
  - "apps/**/*.{tsx,jsx,css,ts,js,html}"
  - "portal/**/*.{tsx,jsx,css,ts,js,html}"
---

# Agency Site — 4 camadas (Next.js)

Inspirado no [central-material](https://central-material.vercel.app).
Referência **tier Premium:** [ARP Fibra](https://grupoarpfibra.com.br/).

Stack: **Next.js 14+ App Router** + Tailwind + shadcn/ui + motion intencional.

**Invoque:** `/agency-site` + produto/marca. Para nível ARP: `/agency-site premium …`

> **Legado:** `apps/*` (Vite) só manutenção. **Site novo** → `projects/<slug>/`.

---

## Tiers

| | **Standard** | **Premium** (padrão para “site top”) |
|---|-------------|--------------------------------------|
| Motion UI | Framer Motion | Framer (hover/micro) + **GSAP + Lenis** |
| Hero | Headline + CTA + visual | **Stack 5–7 camadas** + props float CSS |
| Scroll craft | Reveals leves | **1 seção pinned + scrub** + parallax |
| Seções | 7 essenciais | **13** long-form ([mapa](references/premium-composition.md)) |
| Referência | framer-motion.md | [premium-motion.md](references/premium-motion.md) + [premium-composition.md](references/premium-composition.md) |

**Default:** se o usuário pedir “moderno”, “premium”, “cinematic” ou citar referência
tipo ARP → **Premium**. Pedido simples/rápido → Standard.

---

## As 4 camadas

| Camada | Material | Aqui |
|--------|----------|------|
| **1** | Claude Code | **Cursor Cloud Agent** + `vibe-coding` |
| **2** | Motion | Standard: [framer-motion.md](references/framer-motion.md) · Premium: + [premium-motion.md](references/premium-motion.md) |
| **3** | Design | Esta skill + `anti-ai-landing` + [design-tokens.md](references/design-tokens.md) · Premium: + [premium-composition.md](references/premium-composition.md) |
| **4** | 21st.dev | shadcn + copy prompt — [21st-dev.md](references/21st-dev.md) |

Erros fatais: [errors.md](references/errors.md)

Scroll pesado (vídeo scrub, corridor): skill `scroll-cinematic`.

---

## Onde o projeto vive

```
projects/<slug>/          ← NOVO (Next.js, sai do repo depois)
apps/<nome>/              ← LEGADO Vite (só manutenção)
```

Scaffold: [next-scaffold.md](references/next-scaffold.md)

---

## Fluxo automático

### Passo 0 — Contexto

Peça só o que faltar:

1. Produto/serviço + nicho
2. Marca (@instagram / site / referência visual)
3. CTA (WhatsApp, agendar, form)
4. **Slug** → `projects/<slug>/`
5. **Tier** — Standard ou Premium (inferir do pedido)
6. Domínio futuro (metadata)

Premium: confirmar assets ([lista](references/premium-composition.md#assets-mínimos-brief-antes-de-codar)).

Pedido ambíguo → vibe-coding Fase 1 (brainstorm).

### Passo 1 — Scaffold Next.js

Se `projects/<slug>/` não existe:

```bash
npx create-next-app@latest projects/<slug> \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --turbopack
cd projects/<slug>
npx shadcn@latest init -y
npm install framer-motion
# Premium only:
npm install gsap lenis
```

Defaults shadcn: New York, zinc. Detalhes: [next-scaffold.md](references/next-scaffold.md).

Premium: criar `SmoothScrollProvider` — ver [premium-motion.md](references/premium-motion.md).

### Passo 2 — Camada 2 (motion)

**Standard:** [framer-motion.md](references/framer-motion.md) — budget 2–4 motions.

**Premium:**
1. Lenis provider + GSAP ScrollTrigger no layout
2. Hero: float CSS + Framer stagger no load
3. **1 seção pinned** lifestyle (crossfade + parallax)
4. Reveals GSAP nos grids
5. btn-shine nos CTAs principais

Budget: [premium-motion.md#budget-premium](references/premium-motion.md#budget-premium).

### Passo 3 — Camada 3 (tokens)

Tokens em `src/app/globals.css`:

```css
:root {
  --ink: /* texto / fundo escuro */;
  --paper: /* fundo claro */;
  --surface: /* cards, bege */;
  --accent: /* CTA */;
  --accent-deep: /* hover */;
  --mute: /* secundário */;
}
```

Premium: incluir classes `.text-hero`, `.text-section`, `.text-eyebrow`, `.grain`,
`.btn-shine`, `.reveal-init` — ver [design-tokens.md](references/design-tokens.md).

Brief profundo → `/prompt-site` ou `/premium-site-brief`.

### Passo 4 — Camada 4 (21st.dev)

1. Prompt/componente no 21st.dev
2. `npx shadcn@latest add <url>` quando disponível
3. Adaptar copy + tokens — nunca placeholder

21st.dev entrega **componentes**; hero layered e pin vêm da skill Premium, não do 21st.

### Passo 5 — Estrutura (App Router)

```
src/app/
  layout.tsx          metadata, fonts, SmoothScrollProvider (premium)
  page.tsx            composição de sections
  globals.css         tokens + utility classes premium
src/components/
  providers/          smooth-scroll.tsx (premium)
  sections/           hero, lifestyle-pinned, features, pricing, …
  ui/                 shadcn
```

**Standard** — seções: [initial-prompt.md](references/initial-prompt.md)

**Premium** — mapa completo: [premium-composition.md#mapa-de-seções--tier-premium](references/premium-composition.md#mapa-de-seções--tier-premium)

Construa **uma seção por vez**, ok do usuário entre elas.

### Passo 6 — Performance

- `next/image` + `priority` só no hero LCP
- `next/font` — subset mínimo (display + body)
- WebP/AVIF; lazy nos props da seção pinned
- `ScrollTrigger.refresh()` após load de fonts/images (premium)
- `prefers-reduced-motion` — fallback estático
- `npm run build` verde
- Lighthouse 90+ se pedido

### Passo 7 — Entrega

- [ ] `npm run dev` standalone em `projects/<slug>/`
- [ ] README: install, dev, build, env
- [ ] `.env.example` se secrets
- [ ] Deploy Vercel desacoplado do assemble-dist
- [ ] Premium: pin + reduced-motion testados desktop/mobile

---

## Comandos

```bash
cd projects/<slug>
npm run dev
npm run build
npm run start
```

---

## Legado Vite (`apps/*`)

Só se pedirem app existente. Mesmas Camadas 2–3; GSAP/Lenis permitido. Não migrar
Next sem pedido explícito.

---

## iPhone

```
/agency-site premium landing [MARCA] — [nicho], ref ARP, WhatsApp [n], slug [cliente-x]
```

Standard:

```
/agency-site landing [MARCA] — [nicho], WhatsApp [n], slug [cliente-x]
```

---

## Checklist

**Standard**
- [ ] Next + shadcn + framer-motion
- [ ] Tokens globals.css
- [ ] anti-ai-landing
- [ ] Build verde

**Premium (+)**
- [ ] gsap + lenis + SmoothScrollProvider
- [ ] Hero layered (5+ camadas)
- [ ] 1 seção pinned + parallax + crossfade
- [ ] Tipografia display + `.text-hero`
- [ ] btn-shine + reveals
- [ ] Mapa 13 seções ou subset acordado
- [ ] Reduced motion + mobile pin validados
