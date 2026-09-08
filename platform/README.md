# Black Box Platform

Revenue Operating System for commercial partners — modular monolith (Missions 01–02).

## Requirements

- Node.js 22.x
- npm
- PostgreSQL 16+

## Quick start

```bash
cd platform
cp .env.example .env
# Set DATABASE_URL and AUTH_SECRET (min 32 chars)

npm install --legacy-peer-deps
npm run db:migrate:deploy
npm run db:bootstrap
npm run dev
```

Open http://localhost:3001 → **Sign in** → `/login` with bootstrap credentials from `.env`.

Default bootstrap (`.env.example`):

- Email: `admin@blackbox.local`
- Password: value of `BOOTSTRAP_USER_PASSWORD`

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | yes | PostgreSQL connection string |
| `AUTH_SECRET` | yes | Min 32 characters |
| `NODE_ENV` | no | `development` \| `test` \| `production` |
| `LOG_LEVEL` | no | `debug` \| `info` \| `warn` \| `error` |
| `SESSION_MAX_AGE_SECONDS` | no | Session TTL (default 7 days) |
| `BOOTSTRAP_*` | for bootstrap | Initial org + user (see `.env.example`) |

Configuration is centralized in `src/config/env.ts` — do not read `process.env` directly in application code.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3001) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Vitest (unit + integration) |
| `npm run db:migrate` | Create/apply migrations (dev) |
| `npm run db:migrate:deploy` | Apply migrations (CI/prod) |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:seed` | Run seed (no-op) |
| `npm run db:bootstrap` | Create initial org + user (idempotent) |

From monorepo root:

```bash
npm run dev:platform
npm run build:platform
npm run test:platform
```

## Authentication (Mission 02)

- **Login:** `POST /api/auth/login` — sets httpOnly session cookie
- **Logout:** `POST /api/auth/logout`
- **Current identity:** `GET /api/auth/me`
- **Active organization:** `GET /api/organizations/current`
- **Select organization:** `POST /api/organizations/select` (multi-membership)

Server helpers (`src/lib/auth/context.ts`):

- `getCurrentUser()` / `getCurrentOrganization()`
- `requireAuthenticatedUser()` / `requireActiveOrganization()`

**No RBAC in Mission 02** — authorization arrives in Mission 03.

Protected routes: `/app/*` (middleware + server layout).

## Architecture

```
platform/
├── prisma/              # Schema + migrations (business entities from Mission 02+)
├── database/seeds/      # Seed scripts (no business data in Mission 01)
├── src/
│   ├── app/             # Next.js App Router + API routes
│   ├── components/      # App shell + UI primitives
│   ├── config/          # Environment
│   ├── lib/             # Shared kernel (db, errors, logger, http)
│   └── modules/         # Domain boundaries (see src/modules/README.md)
└── tests/               # Vitest unit + integration
```

### Module boundaries

- Each domain lives under `src/modules/<domain>/`
- Modules must not import each other's internals
- Cross-cutting concerns only in `src/lib/` and `src/config/`
- See `src/modules/README.md`

### Error contract

All API errors follow:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": {}
  }
}
```

HTTP status mapping: 400 validation, 401 unauthorized, 403 forbidden, 404 not found, 409 conflict, 500 internal, 503 unavailable.

### Database

- PostgreSQL via Prisma 6
- UUID convention for future business entities
- `createdAt` / `updatedAt` on future entities
- No soft delete by default
- Migrations versioned in `prisma/migrations/`

Fresh database setup:

```bash
createdb blackbox_platform   # or use your provider
npm run db:migrate:deploy
```

## Health check

```bash
curl http://localhost:3001/api/health
```

Response includes application and database connectivity checks.

## Mission status

- **Mission 01 — Foundation** ✓
- **Mission 02 — Auth + Organization** ✓
- **Next:** Mission 03 — RBAC + Authorization

## Related docs

- `docs/black-box-platform/SPECIFICATION.md` — full architecture
- `docs/black-box-platform/MISSIONS.md` — implementation roadmap
- `docs/black-box-platform/missions/01-fundacao.md` — Mission 01 brief
