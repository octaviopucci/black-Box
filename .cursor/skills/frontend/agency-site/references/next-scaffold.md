# Next.js scaffold — projects/<slug>/

Todo site novo nasce aqui. Projeto **standalone** — copia ou push pro repo do
cliente quando pronto.

## Criar projeto

```bash
npx create-next-app@latest projects/<slug> \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --turbopack
```

## shadcn/ui (obrigatório pra 21st.dev)

```bash
cd projects/<slug>
npx shadcn@latest init
```

Respostas recomendadas:

| Pergunta | Valor |
|----------|-------|
| Style | New York |
| Base color | Zinc (tokens da marca sobrescrevem depois) |
| CSS variables | yes |
| `@/` alias | yes (default) |

## Motion

```bash
npm install framer-motion
```

## Estrutura mínima sugerida

```
projects/<slug>/
├── README.md
├── .env.example
├── src/
│   app/
│   │   layout.tsx
│   │   page.tsx
│   │   globals.css
│   └── components/
│       sections/
│       │   hero.tsx
│       │   features.tsx
│       │   pricing.tsx
│       │   faq.tsx
│       │   footer.tsx
│       │   navbar.tsx
│       └── ui/          ← shadcn
├── public/
└── package.json
```

## layout.tsx — metadata base

```tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '[Marca] — [promise curta]',
  description: '[...]',
  openGraph: { title: '...', description: '...' },
}
```

## README mínimo (template)

```markdown
# [Marca]

Next.js landing — criado via Black Box agency-site skill.

## Dev
npm install && npm run dev

## Build
npm run build && npm run start

## Deploy
Vercel: import repo ou `vercel` na raiz desta pasta.
```

## Exportar do Black Box

1. Copiar pasta `projects/<slug>/` pra repo novo **ou**
2. `git subtree split` / repo dedicado só com essa pasta
3. Remover de `projects/` após handoff (limpeza do monorepo)
4. Cliente conecta Vercel + domínio próprio

Não adicionar scripts em `assemble-dist.mjs` — projetos Next não entram no
build unificado Vite da Black Box.
