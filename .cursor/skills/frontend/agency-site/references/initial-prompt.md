# Prompt inicial — Camada 1+2+3+4

Adaptado do central-material para **Black Box** (Vite, não Next.js).
Substitua `[...]` e cole no Cursor / Cloud Agent (iPhone ok).

---

## Prompt completo

```
/agency-site

Construa uma landing page moderna para [PRODUTO/SERVIÇO] — marca [NOME].

Requisitos:
- App em apps/[slug]/ — Vite + React + TypeScript + Tailwind (padrão Black Box)
- VITE_BASE=/[slug]/ no build
- framer-motion: hero entrance, scroll reveals, hover nos CTAs
- Hero, features e pricing inspirados em componentes do 21st.dev — reimplementados
  pro nosso stack, não Next.js
- Tokens de design em src/index.css (--ink, --paper, --accent, --mute) — sem estética
  genérica de IA (siga anti-ai-landing)
- Navbar fixa, hero headline + CTA, 3 feature cards, prova social, pricing (se SaaS),
  FAQ, footer
- Mobile-first, totalmente responsivo
- Lazy-load imagens, fontes otimizadas
- Comece pela estrutura do app, depois construa seção por seção — mostre cada
  seção antes de passar pra próxima

Contexto:
- Nicho: [NICHO]
- CTA: [WhatsApp / agendar / formulário — link ou número]
- Instagram/site: [@ ou URL se tiver]
```

---

## Prompt curto (iPhone)

```
/agency-site landing [MARCA] — [nicho], CTA WhatsApp [número], app apps/[slug], path /[slug]/
```

---

## Prompt redesign (app existente)

```
/agency-site redesign hero + primeira dobra do apps/[app]/ — manter rotas e build,
só elevar visual pra nível agência. framer-motion + tokens novos. Mostra hero antes do resto.
```

---

## Após cada seção

Usuário responde **ok** ou pede ajuste:

```
Refina espaçamento e contraste do hero. Menos animação no subtítulo.
```

Isso evita o Erro C (não iterar).
