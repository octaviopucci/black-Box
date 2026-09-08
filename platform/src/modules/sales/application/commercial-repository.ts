import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { notFoundError } from '@/lib/errors'
import type { AuthorizationContext } from '@/lib/authorization/types'
import { resolvePartnerDataScope } from '@/lib/authorization/partner-scope'

export function orgWhere(ctx: AuthorizationContext) {
  return { organizationId: ctx.organization.id }
}

export const customerSelect = {
  id: true,
  organizationId: true,
  leadId: true,
  partnerId: true,
  name: true,
  legalName: true,
  document: true,
  email: true,
  phone: true,
  companyName: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CustomerSelect

export const saleSelect = {
  id: true,
  organizationId: true,
  leadId: true,
  customerId: true,
  opportunityId: true,
  partnerId: true,
  productId: true,
  offerId: true,
  status: true,
  productNameSnapshot: true,
  offerNameSnapshot: true,
  listPrice: true,
  finalPrice: true,
  currency: true,
  soldAt: true,
  paidAt: true,
  paidByUserId: true,
  paymentMethod: true,
  paymentReference: true,
  createdAt: true,
  updatedAt: true,
  customer: { select: { id: true, name: true, email: true, companyName: true } },
  partner: { select: { id: true, name: true } },
  offer: { select: { id: true, name: true, slug: true } },
} satisfies Prisma.SaleSelect

export function serializeCustomer(row: Prisma.CustomerGetPayload<{ select: typeof customerSelect }>) {
  return {
    ...row,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export function serializeSale(row: Prisma.SaleGetPayload<{ select: typeof saleSelect }>) {
  return {
    ...row,
    listPrice: row.listPrice.toString(),
    finalPrice: row.finalPrice.toString(),
    soldAt: row.soldAt?.toISOString() ?? null,
    paidAt: row.paidAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}

export async function findCustomerScoped(ctx: AuthorizationContext, id: string) {
  const customer = await prisma.customer.findFirst({
    where: { id, ...orgWhere(ctx) },
    select: customerSelect,
  })
  if (!customer) throw notFoundError()
  return customer
}

export async function findSaleScoped(ctx: AuthorizationContext, id: string) {
  const scope = await resolvePartnerDataScope(ctx)
  const partnerFilter = buildSalePartnerFilter(scope)

  const sale = await prisma.sale.findFirst({
    where: { id, ...orgWhere(ctx), ...partnerFilter },
    select: saleSelect,
  })
  if (!sale) throw notFoundError()
  return sale
}

export function buildSalePartnerFilter(
  scope: Awaited<ReturnType<typeof resolvePartnerDataScope>>,
): Prisma.SaleWhereInput {
  if (scope.type === 'unrestricted') return {}
  if (scope.type === 'none') return { id: { in: [] } }
  return { partnerId: scope.partnerId }
}

export async function findLeadInTenant(organizationId: string, leadId: string) {
  const lead = await prisma.lead.findFirst({
    where: { id: leadId, organizationId },
  })
  if (!lead) throw notFoundError()
  return lead
}

export async function findPartnerInTenant(organizationId: string, partnerId: string) {
  const partner = await prisma.partner.findFirst({
    where: { id: partnerId, organizationId },
  })
  if (!partner) throw notFoundError()
  return partner
}

export async function findOfferInTenant(organizationId: string, offerId: string) {
  const offer = await prisma.offer.findFirst({
    where: { id: offerId, organizationId },
    include: { product: true },
  })
  if (!offer) throw notFoundError()
  return offer
}

export async function findOpportunityInTenant(organizationId: string, opportunityId: string) {
  const opportunity = await prisma.opportunity.findFirst({
    where: { id: opportunityId, organizationId },
    include: { lead: { select: { id: true, partnerId: true } } },
  })
  if (!opportunity) throw notFoundError()
  return opportunity
}
