---
name: agency-site
description: >-
  Setup de 4 camadas para landing/site/SaaS com cara de agência (não genérico IA):
  Cloud Agent + Framer Motion + design tokens + 21st.dev. Use com /agency-site
  ao criar landing, site premium, demo cliente ou SaaS marketing. Funciona no
  iPhone via Cursor Cloud Agent. Integra vibe-coding + anti-ai-landing.
paths:
  - "apps/**/*.{tsx,jsx,css,ts,js,html}"
  - "portal/**/*.{tsx,jsx,css,ts,js,html}"
---

# Agency Site — 4 camadas

Inspirado no setup de [central-material](https://central-material.vercel.app).
Adaptado pro **Black Box**: Vite + React + Tailwind (não Next.js), Cursor Cloud
Agent (não Claude Code CLI).

**Invoque:** `/agency-site` + produto/marca — ou descreva a landing no iPhone.

---

## As 4 camadas (mapeamento real)

| Camada | Material original | No Black Box |
|--------|-------------------|--------------|
| **1** | Claude Code CLI | **Cursor Cloud Agent** + `vibe-coding` (processo automático via `AGENTS.md`) |
| **2** | Framer Motion | `framer-motion` no app — instalar se faltar |
| **3** | Skill de design | **Esta skill** + `anti-ai-landing` + [design-tokens.md](references/design-tokens.md) |
| **4** | 21st.dev | Componentes hero/pricing/nav — ver [21st-dev.md](references/21st-dev.md) |

**Erros a evitar:** [errors.md](references/errors.md)

---

## Fluxo automático (siga na ordem)

### Passo 0 — Contexto mínimo

Peça só o que faltar (bullets, aceita resposta curta do iPhone):

1. **Produto/serviço** + nicho
2. **Marca** (nome, @instagram ou site se tiver)
3. **CTA principal** (WhatsApp, agendar, formulário)
4. **App destino** — novo em `apps/<slug>/` ou redesign de app existente
5. **Path Black Box** — ex.: `/cliente-x/` (`VITE_BASE`)

Se o pedido for grande ou ambíguo → **vibe-coding Fase 1** (brainstorm) antes de codar.

### Passo 1 — Camada 1 (agente + processo)

- Sessão principal **orquestra**; não implementa tudo sozinha.
- Plano com seções verificáveis antes de codar.
- Commits pequenos por seção.

### Passo 2 — Camada 2 (motion)

Antes de implementar, confirme no `package.json` do app:

```bash
npm --prefix apps/<app> install framer-motion
```

**Padrões obrigatórios** — ver [framer-motion.md](references/framer-motion.md):

- Hero: entrada suave (stagger ou fade+rise)
- Seções: scroll reveal (`whileInView`, `viewport: { once: true }`)
- Hover nos CTAs e cards interativos
- `prefers-reduced-motion: reduce` → estático, sem animação

**Budget:** 2–4 motions intencionais — não micro-animação em tudo.

### Passo 3 — Camada 3 (design system)

Antes de JSX, defina tokens em `src/index.css`:

```css
:root {
  --ink: /* texto principal */;
  --paper: /* fundo */;
  --accent: /* CTA / destaque */;
  --mute: /* secundário */;
}
```

Regras completas: [design-tokens.md](references/design-tokens.md).

Carregue mentalmente **`anti-ai-landing`**:

- Uma composição no primeiro viewport
- Full-bleed hero, sem card flutuante genérico
- Tipografia expressiva (não Inter/Roboto como display)
- Sem purple-gradient-SaaS-default

Para brief profundo de marca → `/prompt-site` ou `/premium-site-brief`.

### Passo 4 — Camada 4 (21st.dev)

Para **hero, pricing, testimonials, navbar**:

1. Busque padrão em [21st.dev](https://21st.dev) (referência visual + estrutura)
2. **Adapte** ao stack Vite/React/Tailwind do app — não copie Next.js cru
3. Re-skin com tokens da Camada 3 e copy real da marca

Guia: [21st-dev.md](references/21st-dev.md).

### Passo 5 — Estrutura da página (padrão agency)

Construa **seção por seção**; mostre cada uma antes da próxima (ou peça ok no mobile):

| # | Seção | Obrigatório |
|---|--------|-------------|
| 1 | Navbar fixa | sim |
| 2 | Hero (headline + CTA + visual) | sim |
| 3 | Features (3 cards max) | sim |
| 4 | Prova social / depoimentos | se tiver dado |
| 5 | Pricing | se for SaaS |
| 6 | FAQ | recomendado |
| 7 | Footer | sim |

Prompt base: [initial-prompt.md](references/initial-prompt.md).

### Passo 6 — Performance (não esquecer)

Antes de fechar:

- [ ] Imagens lazy (`loading="lazy"`, dimensões explícitas)
- [ ] Fontes: só pesos usados; `font-display: swap`
- [ ] Build passa: `npm run build:<app>`
- [ ] Motion respeita reduced-motion

Peça auditoria Lighthouse se o usuário quiser 90+.

### Passo 7 — Deploy Black Box

- `VITE_BASE=/<slug>/` no build
- `npm run build:<slug>` ou script equivalente na raiz
- Path listado no portal/README se for demo cliente

---

## Comandos úteis

```bash
# Dev
npm run dev:<app>

# Build (exemplo)
npm run build:harmonie   # apps/clinica-harmonie

# Novo app — copie estrutura de apps/clinica-harmonie ou apps/porthal-imoveis
```

---

## Combo com outras skills

| Situação | Use |
|----------|-----|
| Landing nova premium | `/agency-site` (esta) |
| Marca com Instagram/research profundo | + `/prompt-site` |
| Brief rápido antes de codar | + `/premium-site-brief` |
| Scroll vídeo / corridor | + `scroll-cinematic` |
| Preview Netlify temporário | + `netlify-preview` |
| Processo/PR/commits | automático via `vibe-coding` |

---

## iPhone — o que colar

```
/agency-site landing premium para [MARCA] — nicho [X], CTA WhatsApp, app novo apps/[slug], path /[slug]/
```

Responda brainstorm → **ok** no plano → agente monta seção por seção.

Guia mobile: `.cursor/skills/vibe-coding/references/mobile-iphone.md`

---

## Checklist interno

- [ ] Tokens CSS definidos (Camada 3)
- [ ] framer-motion instalado e usado com parcimônia (Camada 2)
- [ ] Hero/pricing inspirados em 21st.dev, adaptados ao repo (Camada 4)
- [ ] anti-ai-landing respeitado — zero cara de template IA
- [ ] Seção por seção com ok do usuário
- [ ] Build + path VITE_BASE corretos
- [ ] Nenhum dos 4 erros fatais (ver errors.md)
