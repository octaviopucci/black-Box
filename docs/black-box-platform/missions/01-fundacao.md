# Missão 01 — Fundação Técnica

**Status:** COMPLETE  
**Depends-on:** none

## MISSION OBJECTIVE

Fundação técnica executável: estrutura modular, PostgreSQL + Prisma, env centralizado, health check, error/logging/validation foundation, app shell, testes e documentação para Mission 02.

## Implementation location

`platform/` — standalone Next.js 15 app inside the monorepo.

## Key deliverables

- Next.js 15 + TypeScript + Tailwind 4
- Prisma 6 + PostgreSQL + initial migration
- Centralized env (`src/config/env.ts`), logger, errors, HTTP helpers
- `GET /api/health` with DB connectivity check
- App shell (header, nav placeholders, loading/error/empty states)
- Vitest: env validation, errors, health, migration flow
- `platform/README.md`

## Out of scope respected

No auth, RBAC, business entities, fake dashboards, or business seed data.

## Commands verified

```bash
cd platform && npm install --legacy-peer-deps
npm run typecheck && npm run lint && npm run test && npm run build
npm run db:migrate:deploy
npm run dev  # port 3001
curl localhost:3001/api/health
```
