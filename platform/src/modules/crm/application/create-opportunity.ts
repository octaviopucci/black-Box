import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { validationError } from '@/lib/errors'
import type { AuthorizationContext } from '@/lib/authorization/types'
import {
  assertLeadInOrg,
  assertPartnerInOrg,
  assertPipelineInOrg,
  assertStageInPipeline,
  opportunitySelect,
  serializeOpportunity,
} from '@/modules/crm/application/crm-repository'
import { ensureDefaultPipelineForOrganization } from '@/modules/crm/infrastructure/crm-seed'
import type { CreateOpportunityInput } from '@/modules/crm/schemas/create-opportunity.schema'

export async function createOpportunity(
  ctx: AuthorizationContext,
  input: CreateOpportunityInput,
) {
  const lead = await assertLeadInOrg(ctx, input.leadId)

  let pipelineId = input.pipelineId
  let stageId = input.stageId

  if (!pipelineId) {
    const defaults = await ensureDefaultPipelineForOrganization(ctx.organization.id)
    pipelineId = defaults.pipelineId
    stageId = stageId ?? defaults.stages[0]?.id
  }

  if (!pipelineId || !stageId) {
    throw validationError('Pipeline and stage are required')
  }

  await assertPipelineInOrg(ctx, pipelineId)
  await assertStageInPipeline(ctx, stageId, pipelineId)

  const partnerId = input.partnerId ?? lead.partnerId ?? null
  if (partnerId) {
    await assertPartnerInOrg(ctx, partnerId)
    if (lead.partnerId && lead.partnerId !== partnerId) {
      throw validationError('Partner must match the lead partner when lead is already assigned')
    }
  }

  const opportunity = await prisma.$transaction(async (tx) => {
    const created = await tx.opportunity.create({
      data: {
        organizationId: ctx.organization.id,
        leadId: input.leadId,
        partnerId,
        pipelineId,
        stageId,
        title: input.title.trim(),
        description: input.description?.trim(),
        amount: input.amount != null ? new Prisma.Decimal(input.amount) : null,
        probability: input.probability ?? null,
        expectedCloseAt: input.expectedCloseAt ?? null,
      },
      select: opportunitySelect,
    })

    await tx.opportunityStageHistory.create({
      data: {
        organizationId: ctx.organization.id,
        opportunityId: created.id,
        fromStageId: null,
        toStageId: stageId,
        createdByUserId: ctx.user.id,
      },
    })

    return created
  })

  return serializeOpportunity(opportunity)
}
