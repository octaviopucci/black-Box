# Future data layer (Neon + Prisma)

This folder is reserved for the upcoming persistence layer.

Planned stack:
- **Neon** — serverless Postgres
- **Prisma** — ORM / migrations

Current phase uses:
- `src/mocks/` — fictitious datasets
- `src/repositories/` — repository interfaces (in-memory)
- `src/services/` — service contracts mirroring future API

When integrating:
1. Add `prisma/schema.prisma` at `apps/cbx/prisma`
2. Implement repository adapters that call Prisma Client
3. Keep service signatures stable so UI does not change
4. Do **not** call Prisma from React components — always go through services

Do not configure Neon credentials or Prisma in this visual phase.
