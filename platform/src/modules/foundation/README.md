# Foundation module (Mission 01)

Cross-cutting infrastructure shared by all future domains:

- Environment configuration (`src/config/env.ts`)
- Logging (`src/lib/logger.ts`)
- Error contract (`src/lib/errors.ts`)
- HTTP helpers (`src/lib/http/response.ts`)
- Database client (`src/lib/db.ts`)
- Health check API (`src/app/api/health/route.ts`)

Business domains must not live here.
