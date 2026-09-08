import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import type { AuthorizationContext } from '@/lib/authorization/types'
import type { LeadInteractionDto } from '@/modules/leads/domain/lead-interaction'
import { requireLeadInOrganization } from '@/modules/leads/application/lead-repository'

const interactionSelect = {
  id: true,
  organizationId: true,
  leadId: true,
  type: true,
  description: true,
  occurredAt: true,
  createdByUserId: true,
  createdAt: true,
  user: { select: { id: true, name: true } },
} satisfies Prisma.LeadInteractionSelect

function toInteractionDto(
  row: Prisma.LeadInteractionGetPayload<{ select: typeof interactionSelect }>,
): LeadInteractionDto {
  return {
    id: row.id,
    organizationId: row.organizationId,
    leadId: row.leadId,
    type: row.type,
    description: row.description,
    occurredAt: row.occurredAt,
    createdByUserId: row.createdByUserId,
    createdAt: row.createdAt,
    createdBy: row.user,
  }
}

export async function listLeadInteractions(
  ctx: AuthorizationContext,
  leadId: string,
): Promise<LeadInteractionDto[]> {
  await requireLeadInOrganization(leadId, ctx.organization.id)

  const interactions = await prisma.leadInteraction.findMany({
    where: { leadId, organizationId: ctx.organization.id },
    orderBy: { occurredAt: 'desc' },
    select: interactionSelect,
  })

  return interactions.map(toInteractionDto)
}
