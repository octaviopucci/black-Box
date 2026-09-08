import { prisma } from '@/lib/db'
import {
  cleanupRbacFixtures,
  createOrganizationWithRbac,
  createUserWithMembership,
} from '../authorization/helpers'

export { cleanupRbacFixtures as cleanupPartnerFixtures }

export async function createPartnerDirect(
  organizationId: string,
  data: {
    name: string
    status?: 'PENDING' | 'ACTIVE' | 'INACTIVE'
    userId?: string
    document?: string
    email?: string
  },
) {
  return prisma.partner.create({
    data: {
      organizationId,
      name: data.name,
      status: data.status ?? 'PENDING',
      userId: data.userId ?? null,
      document: data.document ?? null,
      email: data.email ?? null,
    },
  })
}

export { createOrganizationWithRbac, createUserWithMembership }

function cookieHeader(token: string) {
  return { cookie: `bb_session=${token}` }
}

export { cookieHeader }

export async function loginSession(userId: string, orgId: string) {
  const { createSession } = await import('@/modules/auth/infrastructure/session-repository')
  const { token } = await createSession(userId, orgId)
  return token
}
