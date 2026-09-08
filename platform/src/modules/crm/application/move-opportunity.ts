import { prisma } from '@/lib/db'
import type { AuthorizationContext } from '@/lib/authorization/types'
import {
  assertStageInPipeline,
  findOpportunityScoped,
  opportunitySelect,
  serializeOpportunity,
} from '@/modules/crm/application/crm-repository'
import type { MoveOpportunityInput } from '@/modules/crm/schemas/move-opportunity.schema'

export async function moveOpportunity(
  ctx: AuthorizationContext,
  id: string,
  input: MoveOpportunityInput,
) {
  const opportunity = await findOpportunityScoped(ctx, id)

  if (opportunity.stageId === input.stageId) {
    return serializeOpportunity(opportunity)
  }

  await assertStageInPipeline(ctx, input.stageId, opportunity.pipelineId)

  const updated = await prisma.$transaction(async (tx) => {
    await tx.opportunityStageHistory.create({
      data: {
        organizationId: ctx.organization.id,
        opportunityId: id,
        fromStageId: opportunity.stageId,
        toStageId: input.stageId,
        createdByUserId: ctx.user.id,
      },
    })

    return tx.opportunity.update({
      where: { id },
      data: { stageId: input.stageId },
      select: opportunitySelect,
    })
  })

  return serializeOpportunity(updated)
}
