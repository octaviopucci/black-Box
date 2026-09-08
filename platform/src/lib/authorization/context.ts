import { prisma } from '@/lib/db'
import {
  inactiveMembershipError,
  inactiveUserError,
  organizationNotFoundError,
  unauthenticatedError,
} from '@/lib/errors'
import { getAuthContext, getAuthContextFromRequest } from '@/lib/auth/context'
import type { AuthorizationContext } from '@/lib/authorization/types'

const requestCache = new WeakMap<Request, AuthorizationContext>()
let cookieCache: AuthorizationContext | null = null

async function loadPermissionsForMembership(membershipId: string): Promise<{
  roles: AuthorizationContext['roles']
  permissions: Set<string>
}> {
  const membershipRoles = await prisma.membershipRole.findMany({
    where: {
      membershipId,
      role: { status: 'ACTIVE' },
    },
    include: {
      role: {
        include: {
          rolePermissions: {
            include: { permission: true },
          },
        },
      },
    },
  })

  const roles = membershipRoles.map((mr) => mr.role)
  const permissions = new Set<string>()

  for (const role of roles) {
    for (const rp of role.rolePermissions) {
      permissions.add(rp.permission.key)
    }
  }

  return { roles, permissions }
}

async function buildAuthorizationContext(
  session: NonNullable<Awaited<ReturnType<typeof getAuthContext>>>,
): Promise<AuthorizationContext | null> {
  if (session.user.status !== 'ACTIVE') {
    throw inactiveUserError()
  }

  if (!session.organization) {
    throw organizationNotFoundError('No active organization in session')
  }

  if (session.organization.status !== 'ACTIVE') {
    throw inactiveMembershipError('Organization is inactive')
  }

  const membership = await prisma.organizationMembership.findUnique({
    where: {
      userId_organizationId: {
        userId: session.user.id,
        organizationId: session.organization.id,
      },
    },
  })

  if (!membership || membership.status !== 'ACTIVE') {
    throw inactiveMembershipError()
  }

  const { roles, permissions } = await loadPermissionsForMembership(membership.id)

  return {
    user: session.user,
    organization: session.organization,
    membership,
    session: session.session,
    roles,
    permissions,
  }
}

export async function getAuthorizationContext(request?: Request): Promise<AuthorizationContext | null> {
  if (request) {
    const cached = requestCache.get(request)
    if (cached) return cached

    const auth = await getAuthContextFromRequest(request)
    if (!auth) return null

    const ctx = await buildAuthorizationContext(auth)
    if (ctx) requestCache.set(request, ctx)
    return ctx
  }

  if (cookieCache) return cookieCache

  const auth = await getAuthContext()
  if (!auth) return null

  const ctx = await buildAuthorizationContext(auth)
  cookieCache = ctx
  return ctx
}

export function clearAuthorizationCacheForTests(): void {
  cookieCache = null
}

export async function requireAuthorizationContext(request?: Request): Promise<AuthorizationContext> {
  const ctx = await getAuthorizationContext(request)
  if (!ctx) throw unauthenticatedError()
  return ctx
}
