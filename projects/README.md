# Projetos Next.js (exportáveis)

Sites novos criados via `/agency-site`.

**Premium (recomendado para site top):**

```bash
bash .cursor/skills/frontend/agency-site/scripts/scaffold-premium.sh <slug>
# customizar projects/<slug>/src/site.config.ts
cd projects/<slug> && npm run dev
```

Cada pasta é **standalone** — handoff pro cliente e remoção daqui na limpeza do monorepo.

**Legado Vite:** continua em `apps/` até migrar ou arquivar.

**Não** adicionar estes projetos ao `assemble-dist.mjs`.
