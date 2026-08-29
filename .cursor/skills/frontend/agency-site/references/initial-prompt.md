# Prompt inicial — Next.js + 4 camadas

Substitua `[...]`. Cole no Cursor / Cloud Agent (iPhone ok).

---

## Prompt completo

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

## Prompt curto (iPhone)

```
/agency-site landing [MARCA] — [nicho], WhatsApp [n], slug [cliente-x]
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
