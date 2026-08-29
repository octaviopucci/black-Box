# 21st.dev — Camada 4 (Next.js nativo)

[21st.dev](https://21st.dev) — 12k+ componentes React + Tailwind + shadcn.

## Por que Next aqui

Componentes do 21st.dev nascem pra **Next.js App Router + shadcn/ui**. Com
`projects/<slug>/` em Next, compatibilidade é **direta** — não precisa
reimplementar de Vite.

---

## Fluxo (padrão)

1. Escolha 1 componente por tipo (hero, pricing, nav…) — mesmo autor/estilo.
2. No 21st.dev → **Copy prompt** ou comando shadcn CLI do componente.
3. No projeto:

```bash
cd projects/<slug>
npx shadcn@latest add "<registry-url-do-componente>"
```

Ou cole o prompt no agente: ele cria em `src/components/`.

4. Re-skin: tokens `--ink`, `--paper`, `--accent` + copy da marca.
5. Aplique `anti-ai-landing` — evite blocos SaaS-purple genéricos.

---

## Categorias por nicho Black Box

| Nicho | 21st.dev |
|-------|----------|
| Clínica / estética | [Heroes](https://21st.dev/community/components/s/hero) editoriais, [testimonials](https://21st.dev/community/components/s/testimonials) |
| Imóveis | Split hero, feature sections, CTA |
| SaaS / gestor | [SaaS heroes](https://21st.dev/community/components/s/hero), [pricing-section](https://21st.dev/community/components/s/pricing-section) |
| Landing completa | [landing-page](https://21st.dev/community/components/s/landing-page) |

Bibliotecas úteis:

- [Magic UI](https://21st.dev/@dillionverma/library/magic-ui) — marketing animado
- [Motion Primitives](https://21st.dev/@ibelick/library/motion-primitives)
- [Aceternity UI](https://21st.dev/@manuarora700/library/aceternity-ui)

---

## MCP 21st (opcional)

Para o agente buscar componentes sozinho:

```bash
npx @21st-dev/cli@latest init --client cursor
```

API key em [21st.dev/mcp](https://21st.dev/mcp). Free: 2 cópias/dia.

---

## Integração App Router

| Peça | Onde |
|------|------|
| Server Components | layout, metadata, sections estáticas |
| `'use client'` | framer-motion, interações, 21st animados |
| `next/image` | fotos hero, OG |
| `next/link` | nav interna |

---

## Anti-patterns

- 3 estilos diferentes na mesma página
- Copy placeholder ("Acme", "$99/mo")
- Instalar componente shadcn sem `shadcn init`
- Ignorar mobile

## Prompt pro agente

```
Instale/adapte hero, pricing e navbar do 21st.dev via shadcn no projects/[slug]/.
Next.js App Router. Tokens da marca em globals.css. Copy real. anti-ai-landing.
```
