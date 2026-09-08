# Missão 02 — Auth + Organization

**Status:** COMPLETE  
**Depends-on:** Mission 01

## MISSION OBJECTIVE

Identity + authentication + session + organization/tenant context. Users can bootstrap, login, receive secure session, access protected area, and server determines user + active organization from session — never from client-supplied IDs.

## Implementation location

`platform/` — modules `auth`, `organization`, `lib/auth`

## Key deliverables

- Prisma models: `User`, `Organization`, `OrganizationMembership`, `Session`
- Argon2id password hashing
- DB-backed sessions with httpOnly cookie (`bb_session`)
- API: `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `GET /api/organizations/current`, `POST /api/organizations/select`
- Server helpers: `getCurrentUser()`, `getCurrentOrganization()`, `requireAuthenticatedUser()`, `requireActiveOrganization()`
- Bootstrap: `npm run db:bootstrap` (idempotent)
- Frontend: `/login`, protected `/app`, org selection when multiple memberships
- No RBAC — roles/permissions deferred to Mission 03

## Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_SECRET` | yes | Min 32 chars |
| `SESSION_MAX_AGE_SECONDS` | no | Default 604800 (7d) |
| `BOOTSTRAP_*` | for bootstrap | Org + initial user |

## Commands verified

```bash
npm run db:migrate:deploy
npm run db:bootstrap
npm run typecheck && npm run lint && npm run test && npm run build
npm run dev  # /login → /app
```

## Out of scope respected

No RBAC, roles, permissions, Partner, or any Mission 04+ modules.
