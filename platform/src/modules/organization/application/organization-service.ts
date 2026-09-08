import { prisma } from '@/lib/db'
import { forbiddenError, inactiveMembershipError, organizationNotFoundError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import {
  getMembership,
  updateSessionOrganization,
  type SessionWithRelations,
} from '@/modules/auth/infrastructure/session-repository'
import type { Organization, User } from '@prisma/client'

export async function selectOrganizationForSession(
  session: SessionWithRelations,
  organizationId: string,
): Promise<Organization> {
  const membership = await getMembership(session.userId, organizationId)

  if (!membership) {
    logger.warn('Organization selection denied — no membership', {
      userId: session.userId,
      organizationId,
    })
    throw forbiddenError('Organization access denied')
  }

  if (membership.status !== 'ACTIVE') {
    throw inactiveMembershipError()
  }

  if (membership.organization.status !== 'ACTIVE') {
    throw organizationNotFoundError('Organization is inactive')
  }

  await updateSessionOrganization(session.id, organizationId)
  logger.info('Organization selected', { userId: session.userId, organizationId })

  return membership.organization
}

export async function getCurrentOrganizationForUser(
  user: User,
  session: SessionWithRelations,
): Promise<Organization | null> {
  if (!session.activeOrganizationId) return null

  const membership = await getMembership(user.id, session.activeOrganizationId)
  if (!membership || membership.status !== 'ACTIVE') {
    await updateSessionOrganization(session.id, null)
    return null
  }

  if (membership.organization.status !== 'ACTIVE') {
    await updateSessionOrganization(session.id, null)
    return null
  }

  return membership.organization
}

export async function listUserOrganizations(userId: string) {
  return prisma.organizationMembership.findMany({
    where: {
      userId,
      status: 'ACTIVE',
      organization: { status: 'ACTIVE' },
    },
    include: { organization: true },
    orderBy: { createdAt: 'asc' },
  })
}
