import { prisma } from '@/lib/db'
import type { AuthorizationContext } from '@/lib/authorization/types'
import { findOpportunityScoped } from '@/modules/crm/application/crm-repository'
import type { CreateCrmInteractionInput } from '@/modules/crm/schemas/create-crm-interaction.schema'

export async function createCrmInteraction(
  ctx: AuthorizationContext,
  opportunityId: string,
  input: CreateCrmInteractionInput,
) {
  await findOpportunityScoped(ctx, opportunityId)

  return prisma.crmInteraction.create({
    data: {
      organizationId: ctx.organization.id,
      opportunityId,
      type: input.type,
      description: input.description.trim(),
      occurredAt: input.occurredAt ?? new Date(),
      createdByUserId: ctx.user.id,
    },
    include: { user: { select: { id: true, name: true } } },
  })
}

export async function listCrmInteractions(
  ctx: AuthorizationContext,
  opportunityId: string,
) {
  await findOpportunityScoped(ctx, opportunityId)

  return prisma.crmInteraction.findMany({
    where: { opportunityId, organizationId: ctx.organization.id },
    orderBy: { occurredAt: 'desc' },
    include: { user: { select: { id: true, name: true } } },
  })
}
