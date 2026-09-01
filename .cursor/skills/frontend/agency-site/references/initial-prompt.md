# Prompt inicial — Next.js + 4 camadas

Substitua `[...]`. Cole no Cursor / Cloud Agent (iPhone ok).

---

## Prompt completo (Standard)

```
/agency-site

Construa uma landing page moderna para [PRODUTO/SERVIÇO] — marca [NOME].

Requisitos:
- Novo projeto Next.js 14+ em projects/[slug]/ — App Router, TypeScript, Tailwind
- shadcn/ui inicializado; framer-motion em animações
- Hero, features e pricing de componentes 21st.dev (shadcn CLI ou copy prompt)
- Tokens em src/app/globals.css (--ink, --paper, --accent, --mute) — anti-ai-landing
- Navbar fixa, hero headline + CTA, 3 feature cards, prova social, pricing (se SaaS),
  FAQ, footer
- next/image + next/font; mobile-first; Lighthouse 90+ se possível
- Construa seção por seção — mostre cada uma antes da próxima
- Projeto standalone (sai do monorepo Black Box depois) — não acoplar ao assemble-dist

Contexto:
- Nicho: [NICHO]
- Slug: [slug]
- CTA: [WhatsApp / agendar / form]
- Instagram/site: [@ ou URL]
```

---

## Prompt Premium (nível ARP Fibra)

```
/agency-site premium

Landing premium para [PRODUTO/SERVIÇO] — marca [NOME].
Referência visual: [ARP Fibra / URL].

Requisitos tier Premium:
- projects/[slug]/ — Next.js 14+, shadcn, framer-motion + gsap + lenis
- SmoothScrollProvider (Lenis + ScrollTrigger.refresh)
- Hero layered (5+ camadas: gradient, blur image, grain, grid, mascote/props float CSS)
- 1 seção lifestyle pinned + scrub (crossfade 3 headlines + parallax data-parallax)
- Mapa long-form: navbar, hero, lifestyle, features grid, statement accent, about,
  pricing, benefícios, produto secundário (se couber), suporte/app, FAQ, social proof,
  footer CTA + footer
- Tokens: --ink, --paper, --surface, --accent, --accent-deep + .text-hero, .btn-shine
- prefers-reduced-motion: sem pin, layout estático
- Seção por seção com ok entre elas
- Standalone, build verde

Contexto:
- Nicho: [NICHO]
- Slug: [slug]
- CTA: [WhatsApp + secundário]
- Assets: [mascote/props/logo — ou placeholder consciente]
```

---

## Prompt curto (iPhone)

Standard:

```
/agency-site landing [MARCA] — [nicho], WhatsApp [n], slug [cliente-x]
```

Premium:

```
/agency-site premium [MARCA] — [nicho], ref ARP, WhatsApp [n], slug [cliente-x]
```

---

## SaaS marketing (com pricing)

```
/agency-site SaaS [PRODUTO] — slug [app-x], pricing 3 tiers, trial 14 dias, CTA signup
```

---

## Redesign legado Vite (exceção)

Só se pedirem app antigo em apps/:

```
/agency-site redesign hero apps/[app]/ — manter Vite, só elevar visual. Não migrar Next.
```

---

## Iteração (Erro C)

```
Refina hero: mais contraste, menos motion no subtítulo, CTA maior no mobile.
```

Premium:

```
Encurtar seção pinned (h-[250vh]), suavizar parallax dos props, headline 2 mais legível no mobile.
```
