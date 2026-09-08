import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { validationError } from '@/lib/errors'
import type { AuthorizationContext } from '@/lib/authorization/types'
import {
  assertPartnerInOrg,
  findOpportunityScoped,
  opportunitySelect,
  serializeOpportunity,
} from '@/modules/crm/application/crm-repository'
import type { UpdateOpportunityInput } from '@/modules/crm/schemas/update-opportunity.schema'

export async function updateOpportunity(
  ctx: AuthorizationContext,
  id: string,
  input: UpdateOpportunityInput,
) {
  const existing = await findOpportunityScoped(ctx, id)

  if (input.partnerId) {
    await assertPartnerInOrg(ctx, input.partnerId)
    const lead = await prisma.lead.findFirst({
      where: { id: existing.leadId, organizationId: ctx.organization.id },
    })
    if (lead?.partnerId && lead.partnerId !== input.partnerId) {
      throw validationError('Partner must match the lead partner when lead is already assigned')
    }
  }

  const data: Prisma.OpportunityUpdateInput = {}
  if (input.title !== undefined) data.title = input.title.trim()
  if (input.description !== undefined) data.description = input.description?.trim() ?? null
  if (input.amount !== undefined) {
    data.amount = input.amount == null ? null : new Prisma.Decimal(input.amount)
  }
  if (input.probability !== undefined) data.probability = input.probability
  if (input.expectedCloseAt !== undefined) data.expectedCloseAt = input.expectedCloseAt
  if (input.partnerId !== undefined) {
    data.partner = input.partnerId
      ? { connect: { id: input.partnerId } }
      : { disconnect: true }
  }

  const updated = await prisma.opportunity.update({
    where: { id },
    data,
    select: opportunitySelect,
  })

  return serializeOpportunity(updated)
}
