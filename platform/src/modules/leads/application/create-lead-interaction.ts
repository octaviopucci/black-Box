import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import type { AuthorizationContext } from '@/lib/authorization/types'
import type { LeadInteractionDto } from '@/modules/leads/domain/lead-interaction'
import { requireLeadInOrganization } from '@/modules/leads/application/lead-repository'
import type { CreateLeadInteractionInput } from '@/modules/leads/schemas/create-lead-interaction.schema'

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

export async function createLeadInteraction(
  ctx: AuthorizationContext,
  leadId: string,
  input: CreateLeadInteractionInput,
): Promise<LeadInteractionDto> {
  await requireLeadInOrganization(leadId, ctx.organization.id)

  const interaction = await prisma.leadInteraction.create({
    data: {
      organizationId: ctx.organization.id,
      leadId,
      type: input.type,
      description: input.description.trim(),
      occurredAt: input.occurredAt ?? new Date(),
      createdByUserId: ctx.user.id,
    },
    select: interactionSelect,
  })

  return toInteractionDto(interaction)
}
