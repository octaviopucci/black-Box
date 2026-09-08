import type { Organization, User } from '@prisma/client'
import {
  inactiveMembershipError,
  inactiveUserError,
  organizationNotFoundError,
  unauthenticatedError,
} from '@/lib/errors'
import { getSessionTokenFromCookies, getSessionTokenFromRequest } from '@/lib/auth/cookies'
import {
  findSessionByToken,
  type SessionWithRelations,
} from '@/modules/auth/infrastructure/session-repository'

export type AuthContext = {
  session: SessionWithRelations
  user: User
  organization: Organization | null
}

export type SafeUser = {
  id: string
  name: string
  email: string
}

export type SafeOrganization = {
  id: string
  name: string
  slug: string
}

export function toSafeUser(user: User): SafeUser {
  return { id: user.id, name: user.name, email: user.email }
}

export function toSafeOrganization(org: Organization): SafeOrganization {
  return { id: org.id, name: org.name, slug: org.slug }
}

async function resolveSession(token: string | undefined): Promise<SessionWithRelations | null> {
  if (!token) return null
  return findSessionByToken(token)
}

export async function getAuthContextFromRequest(request: Request): Promise<AuthContext | null> {
  const token = getSessionTokenFromRequest(request)
  const session = await resolveSession(token)
  if (!session) return null
  return {
    session,
    user: session.user,
    organization: session.activeOrganization,
  }
}

export async function getAuthContext(): Promise<AuthContext | null> {
  const token = await getSessionTokenFromCookies()
  const session = await resolveSession(token)
  if (!session) return null
  return {
    session,
    user: session.user,
    organization: session.activeOrganization,
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const ctx = await getAuthContext()
  return ctx?.user ?? null
}

export async function getCurrentOrganization(): Promise<Organization | null> {
  const ctx = await getAuthContext()
  return ctx?.organization ?? null
}

export async function requireAuthenticatedUser(): Promise<User> {
  const ctx = await getAuthContext()
  if (!ctx) throw unauthenticatedError()

  if (ctx.user.status !== 'ACTIVE') {
    throw inactiveUserError()
  }

  return ctx.user
}

export async function requireActiveOrganization(): Promise<{
  user: User
  organization: Organization
  session: SessionWithRelations
}> {
  const ctx = await getAuthContext()
  if (!ctx) throw unauthenticatedError()

  if (ctx.user.status !== 'ACTIVE') {
    throw inactiveUserError()
  }

  if (!ctx.organization) {
    throw organizationNotFoundError('No active organization in session')
  }

  if (ctx.organization.status !== 'ACTIVE') {
    throw inactiveMembershipError('Organization is inactive')
  }

  return {
    user: ctx.user,
    organization: ctx.organization,
    session: ctx.session,
  }
}

export async function requireAuthenticatedUserFromRequest(request: Request): Promise<User> {
  const ctx = await getAuthContextFromRequest(request)
  if (!ctx) throw unauthenticatedError()
  if (ctx.user.status !== 'ACTIVE') throw inactiveUserError()
  return ctx.user
}
