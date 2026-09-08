import { prisma } from '@/lib/db'
import {
  cleanupRbacFixtures,
  createOrganizationWithRbac,
  createUserWithMembership,
} from '../authorization/helpers'
import { createPartnerDirect } from '../partners/helpers'

export { cleanupRbacFixtures as cleanupLeadFixtures }

export async function createLeadDirect(
  organizationId: string,
  data: {
    name: string
    partnerId?: string
    email?: string
    companyName?: string
    phone?: string
    source?: string
  },
) {
  return prisma.lead.create({
    data: {
      organizationId,
      name: data.name,
      partnerId: data.partnerId ?? null,
      email: data.email ?? null,
      companyName: data.companyName ?? null,
      phone: data.phone ?? null,
      source: data.source ?? null,
    },
  })
}

export { createOrganizationWithRbac, createUserWithMembership, createPartnerDirect }

function cookieHeader(token: string) {
  return { cookie: `bb_session=${token}` }
}

export { cookieHeader }

export async function loginSession(userId: string, orgId: string) {
  const { createSession } = await import('@/modules/auth/infrastructure/session-repository')
  const { token } = await createSession(userId, orgId)
  return token
}
