import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import type { AuthorizationContext } from '@/lib/authorization/types'
import {
  opportunityScopeWhere,
  opportunitySelect,
  serializeOpportunity,
} from '@/modules/crm/application/crm-repository'
import type { ListOpportunitiesQuery } from '@/modules/crm/schemas/list-opportunities.schema'

export async function listOpportunities(
  ctx: AuthorizationContext,
  query: ListOpportunitiesQuery,
) {
  const search = query.search?.trim()
  const scope = opportunityScopeWhere(ctx)

  const where: Prisma.OpportunityWhereInput = {
    ...scope,
    ...(query.pipelineId ? { pipelineId: query.pipelineId } : {}),
    ...(query.stageId ? { stageId: query.stageId } : {}),
    ...(query.partnerId ? { partnerId: query.partnerId } : {}),
    ...(query.leadId ? { leadId: query.leadId } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { lead: { name: { contains: search, mode: 'insensitive' } } },
            { lead: { companyName: { contains: search, mode: 'insensitive' } } },
            { lead: { email: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {}),
  }

  const skip = (query.page - 1) * query.pageSize
  const [rows, total] = await Promise.all([
    prisma.opportunity.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: query.pageSize,
      select: opportunitySelect,
    }),
    prisma.opportunity.count({ where }),
  ])

  return {
    opportunities: rows.map(serializeOpportunity),
    total,
    page: query.page,
    pageSize: query.pageSize,
  }
}
