import type { Organization, OrganizationMembership, User } from '@prisma/client'
import { prisma } from '@/lib/db'
import { getEnv } from '@/config/env'
import { generateSessionToken, hashSessionToken } from '@/modules/auth/infrastructure/session-token'

export type SessionWithRelations = {
  id: string
  userId: string
  activeOrganizationId: string | null
  expiresAt: Date
  user: User
  activeOrganization: Organization | null
}

export async function createSession(
  userId: string,
  activeOrganizationId: string | null,
): Promise<{ token: string; expiresAt: Date }> {
  const env = getEnv()
  const token = generateSessionToken()
  const tokenHash = hashSessionToken(token)
  const expiresAt = new Date(Date.now() + env.SESSION_MAX_AGE_SECONDS * 1000)

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      activeOrganizationId,
      expiresAt,
    },
  })

  return { token, expiresAt }
}

export async function findSessionByToken(token: string): Promise<SessionWithRelations | null> {
  const tokenHash = hashSessionToken(token)
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: {
      user: true,
      activeOrganization: true,
    },
  })

  if (!session) return null
  if (session.expiresAt <= new Date()) {
    await prisma.session.delete({ where: { id: session.id } })
    return null
  }

  return session
}

export async function deleteSessionByToken(token: string): Promise<void> {
  const tokenHash = hashSessionToken(token)
  await prisma.session.deleteMany({ where: { tokenHash } })
}

export async function updateSessionOrganization(
  sessionId: string,
  organizationId: string | null,
): Promise<void> {
  await prisma.session.update({
    where: { id: sessionId },
    data: { activeOrganizationId: organizationId },
  })
}

export async function getActiveMemberships(userId: string) {
  return prisma.organizationMembership.findMany({
    where: {
      userId,
      status: 'ACTIVE',
      organization: { status: 'ACTIVE' },
    },
    include: { organization: true },
  })
}

export async function getMembership(userId: string, organizationId: string) {
  return prisma.organizationMembership.findUnique({
    where: {
      userId_organizationId: { userId, organizationId },
    },
    include: { organization: true },
  })
}

export type { User, Organization, OrganizationMembership }
