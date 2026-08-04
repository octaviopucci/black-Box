# CBX — O Marketplace de Capão Bonito

Primeira versão visual (100% front-end) do marketplace local CBX.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + Design System próprio
- Framer Motion · Lucide · shadcn/Radix
- React Hook Form + Zod (preparados)
- Zustand (estado fake)
- Mock Repository / Service Pattern

## Desenvolvimento

```bash
# Na raiz do monorepo
npm run dev:cbx

# Ou direto
cd apps/cbx && npm run dev
```

Abre em `http://localhost:3000`.

## Build estático (Black Box)

```bash
NEXT_BASE_PATH=/cbx npm run build
# saída em apps/cbx/out → publicada em /cbx/
```

## Arquitetura

```
src/
  app/           # rotas (auth + marketplace)
  components/    # UI, cards, layout, navigation, banners
  services/      # camada de serviço (mock)
  repositories/  # padrão repository (mock → futuro Prisma)
  mocks/         # dados fictícios
  stores/        # Zustand
  types/         # contratos TypeScript
  lib/schemas.ts # Zod preparado
```

Pronto para futura integração com Neon, Prisma, autenticação, upload, pagamentos, chat em tempo real, geolocalização e push — sem implementar nada disso nesta etapa.
