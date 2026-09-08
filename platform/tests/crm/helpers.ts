import { prisma } from '@/lib/db'
import { ensureDefaultPipelineForOrganization } from '@/modules/crm/infrastructure/crm-seed'
import {
  cleanupRbacFixtures,
  createOrganizationWithRbac,
  createUserWithMembership,
} from '../authorization/helpers'
import { createLeadDirect, createPartnerDirect } from '../leads/helpers'

export { cleanupRbacFixtures as cleanupCrmFixtures }

export { createOrganizationWithRbac, createUserWithMembership, createLeadDirect, createPartnerDirect }

export async function ensurePipeline(orgId: string) {
  return ensureDefaultPipelineForOrganization(orgId)
}

export async function createOpportunityDirect(
  organizationId: string,
  data: {
    leadId: string
    pipelineId: string
    stageId: string
    title: string
    partnerId?: string | null
    amount?: string
    probability?: number
  },
) {
  const { Prisma } = await import('@prisma/client')
  return prisma.opportunity.create({
    data: {
      organizationId,
      leadId: data.leadId,
      partnerId: data.partnerId ?? null,
      pipelineId: data.pipelineId,
      stageId: data.stageId,
      title: data.title,
      amount: data.amount != null ? new Prisma.Decimal(data.amount) : null,
      probability: data.probability ?? null,
    },
  })
}

function cookieHeader(token: string) {
  return { cookie: `bb_session=${token}` }
}

export { cookieHeader }

export async function loginSession(userId: string, orgId: string) {
  const { createSession } = await import('@/modules/auth/infrastructure/session-repository')
  const { token } = await createSession(userId, orgId)
  return token
}
