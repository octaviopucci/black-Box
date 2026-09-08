import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { notFoundError, validationError } from '@/lib/errors'
import {
  assertOpportunityInPartnerScope,
  buildOpportunityPartnerFilter,
} from '@/lib/authorization/partner-scope'
import type { AuthorizationContext } from '@/lib/authorization/types'

export function orgWhere(ctx: AuthorizationContext): { organizationId: string } {
  return { organizationId: ctx.organization.id }
}

export function opportunityScopeWhere(
  ctx: AuthorizationContext,
): Prisma.OpportunityWhereInput {
  const partnerFilter = buildOpportunityPartnerFilter(ctx.partnerScope)
  return {
    organizationId: ctx.organization.id,
    ...(partnerFilter ?? {}),
  }
}

export async function findOpportunityScoped(ctx: AuthorizationContext, id: string) {
  const opportunity = await prisma.opportunity.findFirst({
    where: { id, ...opportunityScopeWhere(ctx) },
    include: {
      lead: { select: { id: true, name: true, companyName: true, email: true, partnerId: true } },
      partner: { select: { id: true, name: true } },
      pipeline: { select: { id: true, name: true } },
      stage: { select: { id: true, name: true, position: true } },
    },
  })
  if (!opportunity) throw notFoundError()
  if (
    !assertOpportunityInPartnerScope(ctx.partnerScope, {
      partnerId: opportunity.partnerId,
      lead: opportunity.lead,
    })
  ) {
    throw notFoundError()
  }
  return opportunity
}

export async function assertLeadInOrg(ctx: AuthorizationContext, leadId: string) {
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, organizationId: ctx.organization.id },
  })
  if (!lead) throw validationError('Lead not found in this organization')
  return lead
}

export async function assertPartnerInOrg(ctx: AuthorizationContext, partnerId: string) {
  const partner = await prisma.partner.findFirst({
    where: { id: partnerId, organizationId: ctx.organization.id },
  })
  if (!partner) throw validationError('Partner not found in this organization')
  return partner
}

export async function assertPipelineInOrg(
  ctx: AuthorizationContext,
  pipelineId: string,
  options?: { requireActive?: boolean },
) {
  const pipeline = await prisma.pipeline.findFirst({
    where: { id: pipelineId, organizationId: ctx.organization.id },
    include: { stages: { orderBy: { position: 'asc' } } },
  })
  if (!pipeline) throw validationError('Pipeline not found in this organization')
  if (options?.requireActive && !pipeline.isActive) {
    throw validationError('Pipeline is inactive and cannot accept new opportunities')
  }
  return pipeline
}

export async function assertStageInPipeline(
  ctx: AuthorizationContext,
  stageId: string,
  pipelineId: string,
) {
  const stage = await prisma.pipelineStage.findFirst({
    where: { id: stageId, pipelineId, organizationId: ctx.organization.id },
  })
  if (!stage) throw validationError('Stage not found in this pipeline')
  return stage
}

export const opportunitySelect = {
  id: true,
  organizationId: true,
  leadId: true,
  partnerId: true,
  pipelineId: true,
  stageId: true,
  title: true,
  description: true,
  amount: true,
  probability: true,
  expectedCloseAt: true,
  createdAt: true,
  updatedAt: true,
  lead: { select: { id: true, name: true, companyName: true, email: true } },
  partner: { select: { id: true, name: true } },
  pipeline: { select: { id: true, name: true } },
  stage: { select: { id: true, name: true, position: true } },
} satisfies Prisma.OpportunitySelect

export function serializeOpportunity(
  row: Prisma.OpportunityGetPayload<{ select: typeof opportunitySelect }>,
) {
  return {
    ...row,
    amount: row.amount != null ? row.amount.toString() : null,
    expectedCloseAt: row.expectedCloseAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}
