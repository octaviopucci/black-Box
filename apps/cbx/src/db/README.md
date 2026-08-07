# Future data layer — now implemented

See **BACKEND.md** for Neon + Prisma + Auth setup.

Quick start:
1. Copy `.env.example` → `.env` with Neon `DATABASE_URL`
2. `npx prisma migrate dev --name init`
3. `npm run db:seed`
4. `npm run dev`
