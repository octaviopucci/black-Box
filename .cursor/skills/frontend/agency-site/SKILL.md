---
name: agency-site
description: >-
  Setup de 4 camadas para landing/site/SaaS com cara de agência: Cloud Agent +
  Next.js App Router + Framer Motion + design tokens + 21st.dev/shadcn. Projetos
  nascem em projects/<slug>/ — standalone, prontos pra sair do repo Black Box.
  Use /agency-site. Integra vibe-coding + anti-ai-landing. iPhone ok.
paths:
  - "projects/**/*.{tsx,jsx,css,ts,js,html}"
  - "apps/**/*.{tsx,jsx,css,ts,js,html}"
  - "portal/**/*.{tsx,jsx,css,ts,js,html}"
---

# Agency Site — 4 camadas (Next.js)

Inspirado no [central-material](https://central-material.vercel.app).
Stack **padrão para projetos novos:** **Next.js 14+ App Router** + Tailwind +
shadcn/ui + framer-motion — compatível nativo com 21st.dev.

**Invoque:** `/agency-site` + produto/marca.

> **Legado:** `apps/*` (Vite) só para manutenção de demos antigas. **Todo site
> novo** → `projects/<slug>/` (Next standalone, exportável pro cliente).

---

## As 4 camadas

| Camada | Material | Aqui |
|--------|----------|------|
| **1** | Claude Code | **Cursor Cloud Agent** + `vibe-coding` |
| **2** | Framer Motion | `framer-motion` + `'use client'` onde animar |
| **3** | Skill de design | Esta skill + `anti-ai-landing` + [design-tokens.md](references/design-tokens.md) |
| **4** | 21st.dev | shadcn + copy prompt — [21st-dev.md](references/21st-dev.md) |

Erros fatais: [errors.md](references/errors.md)

---

## Onde o projeto vive

```
projects/<slug>/          ← NOVO (Next.js, sai do repo depois)
apps/<nome>/              ← LEGADO Vite (só manutenção, não criar novos)
```

Cada `projects/<slug>/` é um app Next **independente** — repo próprio, deploy
Vercel do cliente, domínio deles. Black Box é só incubadora temporária.

Scaffold: [next-scaffold.md](references/next-scaffold.md)

---

## Fluxo automático

### Passo 0 — Contexto

Peça só o que faltar:

1. Produto/serviço + nicho
2. Marca (@instagram / site)
3. CTA (WhatsApp, agendar, form)
4. **Slug** → `projects/<slug>/`
5. Domínio futuro (se souber) — configura metadata depois

Pedido ambíguo → vibe-coding Fase 1 (brainstorm).

### Passo 1 — Scaffold Next.js

Se `projects/<slug>/` não existe, crie antes de codar UI:

```bash
npx create-next-app@latest projects/<slug> \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*" --turbopack
cd projects/<slug>
npx shadcn@latest init -y
npm install framer-motion
```

Defaults shadcn: New York, zinc, CSS variables. Detalhes em [next-scaffold.md](references/next-scaffold.md).

### Passo 2 — Camada 2 (motion)

Ver [framer-motion.md](references/framer-motion.md). Componentes animados =
`'use client'`. Budget: 2–4 motions intencionais.

### Passo 3 — Camada 3 (tokens)

Tokens em `src/app/globals.css` (sobre `:root` do shadcn):

```css
:root {
  --ink: /* texto */;
  --paper: /* fundo */;
  --accent: /* CTA */;
  --mute: /* secundário */;
}
```

Mapeie `--primary` do shadcn pro `--accent` da marca quando fizer sentido.
Regras: [design-tokens.md](references/design-tokens.md) + `anti-ai-landing`.

Brief profundo → `/prompt-site` ou `/premium-site-brief`.

### Passo 4 — Camada 4 (21st.dev)

1. Copie o **prompt** do componente no 21st.dev (ou MCP 21st)
2. Instale via shadcn CLI quando disponível: `npx shadcn@latest add <url>`
3. Adapte copy + tokens da marca — nunca placeholder

Guia: [21st-dev.md](references/21st-dev.md)

### Passo 5 — Estrutura (App Router)

```
src/app/
  layout.tsx      metadata, fonts
  page.tsx        landing (ou composição de sections)
  globals.css     tokens
src/components/
  sections/       hero, features, pricing, faq, footer
  ui/             shadcn
```

Seções padrão — construa **uma por vez**, ok do usuário entre elas:

| # | Seção |
|---|--------|
| 1 | Navbar fixa |
| 2 | Hero (headline + CTA + visual) |
| 3 | Features (max 3) |
| 4 | Prova social |
| 5 | Pricing (se SaaS) |
| 6 | FAQ |
| 7 | Footer |

Prompt: [initial-prompt.md](references/initial-prompt.md)

### Passo 6 — Performance

- `next/image` com `width`/`height` + `priority` só no hero LCP
- `next/font` — subset de pesos
- `npm run build` verde em `projects/<slug>/`
- Lighthouse 90+ se pedido

### Passo 7 — Entrega / saída do Black Box

Antes de considerar pronto:

- [ ] `projects/<slug>/` roda sozinho (`npm run dev` dentro da pasta)
- [ ] README mínimo: install, dev, build, env vars
- [ ] `.env.example` se houver secrets
- [ ] Deploy Vercel: conectar repo ou `vercel --cwd projects/<slug>`
- [ ] **Não** acoplar ao `assemble-dist` / `VITE_BASE` — projeto sai intacto

Opcional: link temporário no portal Black Box só se o usuário pedir preview
no domínio blckbox — não é o padrão.

---

## Comandos

```bash
cd projects/<slug>
npm run dev          # localhost:3000
npm run build
npm run start
```

---

## Legado Vite (`apps/*`)

Só toque se o pedido nomear app existente (`apps/harmonie`, etc.). Nesse caso:

- Mantenha Vite + `VITE_BASE`
- Não migre pra Next sem pedido explícito de migração
- Para elevar visual: mesmas Camadas 2–3, 21st.dev como referência adaptada

---

## iPhone

```
/agency-site landing [MARCA] — [nicho], WhatsApp [n], slug [cliente-x]
```

Cria `projects/cliente-x/` em Next. Brainstorm → ok → seção por seção.

---

## Checklist

- [ ] Next + shadcn + framer-motion scaffoldados
- [ ] Tokens em globals.css
- [ ] 21st.dev integrado (shadcn nativo)
- [ ] anti-ai-landing respeitado
- [ ] Build standalone verde
- [ ] Pronto pra exportar do monorepo
