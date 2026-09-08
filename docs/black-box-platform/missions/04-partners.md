# Missão 04 — Partners

**Status:** COMPLETE  
**Depends-on:** Mission 01, 02, 03

## MISSION OBJECTIVE

First business module: tenant-scoped Partner entity, CRUD + lifecycle, RBAC via existing permission gates, User ↔ Partner optional link.

## Key deliverables

- Prisma model `Partner` with status `PENDING | ACTIVE | INACTIVE`
- Module `src/modules/partners/`
- API: `GET/POST /api/partners`, `GET/PATCH /api/partners/:id`, activate/deactivate
- Permissions: `partner.read`, `partner.create`, `partner.update`, `partner.activate`
- Frontend: `/app/partners`, `/app/partners/new`, `/app/partners/[id]`
- Tests: CRUD, RBAC, tenant isolation, IDOR, user association, status transitions

## Commands verified

```bash
npm run db:generate && npm run db:migrate:deploy && npm run test && npm run typecheck && npm run lint && npm run build
```
