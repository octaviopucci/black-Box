import { prisma } from '@/lib/db'
import { notFoundError, validationError } from '@/lib/errors'

export async function assertPartnerInOrganization(
  organizationId: string,
  partnerId: string,
): Promise<void> {
  const partner = await prisma.partner.findFirst({
    where: { id: partnerId, organizationId },
  })
  if (!partner) {
    throw validationError('Partner not found in this organization')
  }
}

export async function findLeadInOrganization(leadId: string, organizationId: string) {
  return prisma.lead.findFirst({
    where: { id: leadId, organizationId },
  })
}

export async function requireLeadInOrganization(leadId: string, organizationId: string) {
  const lead = await findLeadInOrganization(leadId, organizationId)
  if (!lead) throw notFoundError()
  return lead
}
