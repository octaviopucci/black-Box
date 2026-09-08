import { prisma } from '@/lib/db'
import type { AuthorizationContext } from '@/lib/authorization/types'
import {
  findOpportunityScoped,
  serializeOpportunity,
} from '@/modules/crm/application/crm-repository'

export async function getOpportunity(ctx: AuthorizationContext, id: string) {
  const opportunity = await findOpportunityScoped(ctx, id)
  return serializeOpportunity(opportunity)
}

export async function getOpportunityStageHistory(ctx: AuthorizationContext, id: string) {
  await findOpportunityScoped(ctx, id)
  const history = await prisma.opportunityStageHistory.findMany({
    where: { opportunityId: id, organizationId: ctx.organization.id },
    orderBy: { createdAt: 'asc' },
    include: {
      fromStage: { select: { id: true, name: true } },
      toStage: { select: { id: true, name: true } },
      user: { select: { id: true, name: true } },
    },
  })
  return history
}
