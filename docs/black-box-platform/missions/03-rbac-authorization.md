# Missão 03 — RBAC + Authorization

**Status:** COMPLETE  
**Depends-on:** Mission 01, Mission 02

## MISSION OBJECTIVE

Central authorization: tenant-scoped roles, permission catalog, role assignment via membership, server-side gates, tenant isolation, privilege escalation protection.

## Implementation location

`platform/` — `lib/authorization/`, `modules/authorization/`, `prisma/schema.prisma`, `database/bootstrap.ts`

## Key deliverables

- Prisma models: `Role`, `Permission`, `RolePermission`, `MembershipRole`
- Default roles per org: `admin`, `gestor`, `parceiro`
- Permission catalog in `src/lib/authorization/permissions.ts` (`PERMISSIONS.*`)
- Authorization context: session → membership → roles → permissions
- Gates: `hasPermission`, `requirePermission`, `hasAnyPermission`, `hasAllPermissions`, `hasRole`, `requireRole`
- Bootstrap evolved: idempotent RBAC seed + ADMIN assignment to bootstrap user
- API: `/api/authorization/roles/*`, `/api/organizations/memberships/:id/roles/*`
- Tests: permission catalog, gates, tenant isolation, privilege escalation, bootstrap RBAC

## Authorization flow

```
REQUEST → SESSION → USER → MEMBERSHIP → ORGANIZATION → ROLE → PERMISSIONS → ALLOW/DENY
```

## Security

- 401 unauthenticated · 403 forbidden (generic, no RBAC internals)
- Tenant from session only — never from request body/query
- ADMIN is tenant-scoped
- INACTIVE role/membership/org → deny by default

## Commands verified

```bash
npm run db:generate
npm run db:migrate:deploy
npm run db:bootstrap
npm run typecheck && npm run lint && npm run test && npm run build
```
