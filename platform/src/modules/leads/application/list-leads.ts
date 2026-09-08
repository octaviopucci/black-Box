import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import type { AuthorizationContext } from '@/lib/authorization/types'
import type { LeadDto } from '@/modules/leads/domain/lead'
import type { ListLeadsQuery } from '@/modules/leads/schemas/list-leads.schema'

const leadSelect = {
  id: true,
  organizationId: true,
  partnerId: true,
  name: true,
  companyName: true,
  email: true,
  phone: true,
  document: true,
  notes: true,
  source: true,
  createdAt: true,
  updatedAt: true,
  partner: { select: { id: true, name: true } },
} satisfies Prisma.LeadSelect

function toLeadDto(lead: Prisma.LeadGetPayload<{ select: typeof leadSelect }>): LeadDto {
  return {
    id: lead.id,
    organizationId: lead.organizationId,
    partnerId: lead.partnerId,
    name: lead.name,
    companyName: lead.companyName,
    email: lead.email,
    phone: lead.phone,
    document: lead.document,
    notes: lead.notes,
    source: lead.source,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
    partner: lead.partner,
  }
}

export async function listLeads(
  ctx: AuthorizationContext,
  query: ListLeadsQuery,
): Promise<{ leads: LeadDto[]; total: number; page: number; pageSize: number }> {
  const organizationId = ctx.organization.id
  const search = query.search?.trim()

  const where: Prisma.LeadWhereInput = {
    organizationId,
    ...(query.partnerId ? { partnerId: query.partnerId } : {}),
    ...(query.source ? { source: query.source } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { companyName: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  }

  const skip = (query.page - 1) * query.pageSize

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: query.pageSize,
      select: leadSelect,
    }),
    prisma.lead.count({ where }),
  ])

  return {
    leads: leads.map(toLeadDto),
    total,
    page: query.page,
    pageSize: query.pageSize,
  }
}
