import { forbiddenError, unauthenticatedError } from '@/lib/errors'
import type { PermissionKey } from '@/lib/authorization/permissions'
import { ROLE_SLUGS, type RoleSlug } from '@/lib/authorization/roles'
import {
  getAuthorizationContext,
  requireAuthorizationContext,
} from '@/lib/authorization/context'

export async function hasPermission(
  permission: PermissionKey,
  request?: Request,
): Promise<boolean> {
  const ctx = await getAuthorizationContext(request)
  if (!ctx) return false
  return ctx.permissions.has(permission)
}

export async function hasAnyPermission(
  permissions: PermissionKey[],
  request?: Request,
): Promise<boolean> {
  const ctx = await getAuthorizationContext(request)
  if (!ctx) return false
  return permissions.some((p) => ctx.permissions.has(p))
}

export async function hasAllPermissions(
  permissions: PermissionKey[],
  request?: Request,
): Promise<boolean> {
  const ctx = await getAuthorizationContext(request)
  if (!ctx) return false
  return permissions.every((p) => ctx.permissions.has(p))
}

export async function requirePermission(
  permission: PermissionKey,
  request?: Request,
): Promise<void> {
  const ctx = await requireAuthorizationContext(request)
  if (!ctx.permissions.has(permission)) {
    throw forbiddenError()
  }
}

export async function hasRole(roleSlug: RoleSlug, request?: Request): Promise<boolean> {
  const ctx = await getAuthorizationContext(request)
  if (!ctx) return false
  return ctx.roles.some((r) => r.slug === roleSlug && r.status === 'ACTIVE')
}

export async function requireRole(roleSlug: RoleSlug, request?: Request): Promise<void> {
  const allowed = await hasRole(roleSlug, request)
  if (!allowed) throw forbiddenError()
}

export function assertCanAssignRoleSlug(
  callerPermissions: Set<string>,
  targetRoleSlug: string,
): void {
  const normalized = targetRoleSlug.toLowerCase()
  if (
    (normalized === ROLE_SLUGS.ADMIN || normalized === ROLE_SLUGS.GESTOR) &&
    !callerPermissions.has('authorization.membership.assign_role')
  ) {
    throw forbiddenError()
  }
}

export async function requireAuthenticatedForAuthorization(request?: Request): Promise<void> {
  const ctx = await getAuthorizationContext(request)
  if (!ctx) throw unauthenticatedError()
}
