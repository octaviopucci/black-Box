import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import type { AuthorizationContext } from '@/lib/authorization/types'
import { notFoundError } from '@/lib/errors'
import type { LeadDto } from '@/modules/leads/domain/lead'

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

export async function getLead(
  ctx: AuthorizationContext,
  leadId: string,
): Promise<LeadDto> {
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, organizationId: ctx.organization.id },
    select: leadSelect,
  })

  if (!lead) throw notFoundError()
  return toLeadDto(lead)
}
