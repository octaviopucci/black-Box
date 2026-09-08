import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import type { AuthorizationContext } from '@/lib/authorization/types'
import { notFoundError, validationError } from '@/lib/errors'
import {
  normalizeDocument,
  normalizeLeadEmail,
  normalizeLeadName,
  normalizeOptionalText,
  type LeadDto,
} from '@/modules/leads/domain/lead'
import {
  assertPartnerInOrganization,
  requireLeadInOrganization,
} from '@/modules/leads/application/lead-repository'
import type { UpdateLeadInput } from '@/modules/leads/schemas/update-lead.schema'

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

export async function updateLead(
  ctx: AuthorizationContext,
  leadId: string,
  input: UpdateLeadInput,
): Promise<LeadDto> {
  await requireLeadInOrganization(leadId, ctx.organization.id)

  if (input.partnerId) {
    await assertPartnerInOrganization(ctx.organization.id, input.partnerId)
  }

  const data: Prisma.LeadUpdateInput = {}

  if (input.name !== undefined) {
    const name = normalizeLeadName(input.name)
    if (!name) throw validationError('Name is required')
    data.name = name
  }
  if (input.companyName !== undefined) {
    data.companyName = input.companyName === null ? null : normalizeOptionalText(input.companyName)
  }
  if (input.email !== undefined) {
    data.email = input.email === null ? null : normalizeLeadEmail(input.email)
  }
  if (input.phone !== undefined) {
    data.phone = input.phone === null ? null : normalizeOptionalText(input.phone)
  }
  if (input.document !== undefined) {
    data.document = input.document === null ? null : normalizeDocument(input.document)
  }
  if (input.notes !== undefined) {
    data.notes = input.notes === null ? null : normalizeOptionalText(input.notes)
  }
  if (input.source !== undefined) {
    data.source = input.source === null ? null : normalizeOptionalText(input.source)
  }
  if (input.partnerId !== undefined) {
    data.partner = input.partnerId
      ? { connect: { id: input.partnerId } }
      : { disconnect: true }
  }

  const lead = await prisma.lead.update({
    where: { id: leadId },
    data,
    select: leadSelect,
  })

  if (lead.organizationId !== ctx.organization.id) {
    throw notFoundError()
  }

  return toLeadDto(lead)
}
