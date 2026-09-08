import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { validationError } from '@/lib/errors'
import type { AuthorizationContext } from '@/lib/authorization/types'
import {
  normalizeDocument,
  normalizeLeadEmail,
  normalizeLeadName,
  normalizeOptionalText,
  type LeadDto,
} from '@/modules/leads/domain/lead'
import { assertPartnerInOrganization } from '@/modules/leads/application/lead-repository'
import type { CreateLeadInput } from '@/modules/leads/schemas/create-lead.schema'

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

export async function createLead(
  ctx: AuthorizationContext,
  input: CreateLeadInput,
): Promise<LeadDto> {
  const name = normalizeLeadName(input.name)
  if (!name) throw validationError('Name is required')

  if (input.partnerId) {
    await assertPartnerInOrganization(ctx.organization.id, input.partnerId)
  }

  const lead = await prisma.lead.create({
    data: {
      organizationId: ctx.organization.id,
      name,
      companyName: normalizeOptionalText(input.companyName),
      email: normalizeLeadEmail(input.email),
      phone: normalizeOptionalText(input.phone),
      document: normalizeDocument(input.document),
      partnerId: input.partnerId ?? null,
      notes: normalizeOptionalText(input.notes),
      source: normalizeOptionalText(input.source),
    },
    select: leadSelect,
  })

  return toLeadDto(lead)
}
