import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import {
  forbiddenError,
  notFoundError,
  validationError,
} from '@/lib/errors'
import { PERMISSIONS } from '@/lib/authorization/permissions'
import type { AuthorizationContext } from '@/lib/authorization/types'
import { resolvePartnerDataScope } from '@/lib/authorization/partner-scope'
import {
  normalizeDocument,
  normalizeEmail,
  normalizePhone,
} from '@/modules/customers/domain/normalize'
import {
  assertValidSaleStatusTransition,
  canConfirmPayment,
} from '@/modules/sales/domain/sale-status'
import {
  buildSalePartnerFilter,
  customerSelect,
  findOfferInTenant,
  findOpportunityInTenant,
  findPartnerInTenant,
  findSaleScoped,
  orgWhere,
  saleSelect,
  serializeSale,
} from '@/modules/sales/application/commercial-repository'
import type {
  ConfirmPaymentInput,
  CreateSaleInput,
  ListSalesQuery,
  UpdateSaleInput,
} from '@/modules/sales/schemas/sale.schema'

function parsePrice(value: string): Prisma.Decimal {
  const decimal = new Prisma.Decimal(value)
  if (decimal.isNegative()) {
    throw validationError('Price must be greater than or equal to zero')
  }
  return decimal
}

function assertOfferSellable(offer: { status: string; product: { status: string } }) {
  if (offer.status !== 'ACTIVE') {
    throw validationError('Offer must be ACTIVE to create a sale')
  }
  if (offer.product.status !== 'ACTIVE') {
    throw validationError('Product must be ACTIVE to create a sale')
  }
}

async function assertPriceOverrideAllowed(ctx: AuthorizationContext, listPrice: Prisma.Decimal, finalPrice: Prisma.Decimal) {
  if (!listPrice.equals(finalPrice) && !ctx.permissions.has(PERMISSIONS.SALE_UPDATE)) {
    throw forbiddenError('Price override requires sale.update permission')
  }
}

export async function createSale(ctx: AuthorizationContext, input: CreateSaleInput) {
  if (!input.customerId && !input.leadId) {
    throw validationError('customerId or leadId is required')
  }

  const offer = await findOfferInTenant(ctx.organization.id, input.offerId)
  assertOfferSellable(offer)

  const listPrice = offer.price
  const finalPrice = input.finalPrice ? parsePrice(input.finalPrice) : listPrice
  await assertPriceOverrideAllowed(ctx, listPrice, finalPrice)

  let opportunity: Awaited<ReturnType<typeof findOpportunityInTenant>> | null = null
  if (input.opportunityId) {
    opportunity = await findOpportunityInTenant(ctx.organization.id, input.opportunityId)
    if (input.leadId && opportunity.leadId !== input.leadId) {
      throw validationError('Opportunity lead does not match sale lead')
    }
  }

  let partnerId = input.partnerId ?? null
  if (partnerId) {
    await findPartnerInTenant(ctx.organization.id, partnerId)
  } else if (opportunity?.partnerId) {
    partnerId = opportunity.partnerId
  }

  const status = input.status ?? 'DRAFT'
  if (status !== 'DRAFT' && status !== 'PENDING_PAYMENT') {
    throw validationError('Initial sale status must be DRAFT or PENDING_PAYMENT')
  }

  const sale = await prisma.$transaction(async (tx) => {
    let customer
    if (input.customerId) {
      customer = await tx.customer.findFirst({
        where: { id: input.customerId, organizationId: ctx.organization.id },
        select: customerSelect,
      })
      if (!customer) throw notFoundError()
    } else if (input.leadId || opportunity?.leadId) {
      const leadId = input.leadId ?? opportunity!.leadId
      const lead = await tx.lead.findFirst({
        where: { id: leadId, organizationId: ctx.organization.id },
      })
      if (!lead) throw notFoundError()

      customer = await tx.customer.findFirst({
        where: { organizationId: ctx.organization.id, leadId: lead.id },
        select: customerSelect,
      })

      if (!customer) {
        const document = normalizeDocument(lead.document)
        const email = normalizeEmail(lead.email)
        customer = await tx.customer.create({
          data: {
            organizationId: ctx.organization.id,
            leadId: lead.id,
            partnerId: lead.partnerId,
            name: lead.name,
            companyName: lead.companyName,
            email: email ?? null,
            phone: normalizePhone(lead.phone) ?? null,
            document: document ?? null,
            status: 'ACTIVE',
          },
          select: customerSelect,
        })
      }
    } else {
      throw validationError('customerId or leadId is required')
    }

    if (opportunity && customer.leadId && opportunity.leadId !== customer.leadId) {
      throw validationError('Opportunity lead does not match customer lead')
    }

    const resolvedLeadId = input.leadId ?? customer.leadId ?? opportunity?.leadId ?? null
    let resolvedPartnerId = partnerId
    if (!resolvedPartnerId && customer.partnerId) {
      resolvedPartnerId = customer.partnerId
    }

    return tx.sale.create({
      data: {
        organizationId: ctx.organization.id,
        customerId: customer.id,
        leadId: resolvedLeadId,
        opportunityId: input.opportunityId ?? null,
        partnerId: resolvedPartnerId,
        productId: offer.productId,
        offerId: offer.id,
        status,
        productNameSnapshot: offer.product.name,
        offerNameSnapshot: offer.name,
        listPrice,
        finalPrice,
        currency: offer.currency,
        soldAt: status === 'PENDING_PAYMENT' ? new Date() : null,
      },
      select: saleSelect,
    })
  })

  return serializeSale(sale)
}

export async function listSales(ctx: AuthorizationContext, query: ListSalesQuery) {
  const scope = await resolvePartnerDataScope(ctx)
  const search = query.search?.trim()

  const where: Prisma.SaleWhereInput = {
    ...orgWhere(ctx),
    ...buildSalePartnerFilter(scope),
    ...(query.status ? { status: query.status } : {}),
    ...(query.partnerId ? { partnerId: query.partnerId } : {}),
    ...(query.customerId ? { customerId: query.customerId } : {}),
    ...(query.offerId ? { offerId: query.offerId } : {}),
    ...(query.soldFrom || query.soldTo
      ? {
          soldAt: {
            ...(query.soldFrom ? { gte: new Date(query.soldFrom) } : {}),
            ...(query.soldTo ? { lte: new Date(query.soldTo) } : {}),
          },
        }
      : {}),
    ...(search
      ? {
          OR: [
            { offerNameSnapshot: { contains: search, mode: 'insensitive' } },
            { productNameSnapshot: { contains: search, mode: 'insensitive' } },
            { customer: { name: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {}),
  }

  const skip = (query.page - 1) * query.pageSize
  const [rows, total] = await Promise.all([
    prisma.sale.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: query.pageSize,
      select: saleSelect,
    }),
    prisma.sale.count({ where }),
  ])

  return {
    sales: rows.map(serializeSale),
    total,
    page: query.page,
    pageSize: query.pageSize,
  }
}

export async function getSale(ctx: AuthorizationContext, id: string) {
  const sale = await findSaleScoped(ctx, id)

  const [lead, opportunity] = await Promise.all([
    sale.leadId
      ? prisma.lead.findFirst({
          where: { id: sale.leadId, organizationId: ctx.organization.id },
          select: { id: true, name: true, email: true },
        })
      : null,
    sale.opportunityId
      ? prisma.opportunity.findFirst({
          where: { id: sale.opportunityId, organizationId: ctx.organization.id },
          select: { id: true, title: true },
        })
      : null,
  ])

  return {
    sale: serializeSale(sale),
    lead,
    opportunity,
  }
}

export async function updateSale(
  ctx: AuthorizationContext,
  id: string,
  input: UpdateSaleInput,
) {
  const existing = await findSaleScoped(ctx, id)

  if (input.status) {
    assertValidSaleStatusTransition(existing.status, input.status)
  }

  if (input.partnerId) {
    await findPartnerInTenant(ctx.organization.id, input.partnerId)
  }

  let finalPrice = existing.finalPrice
  if (input.finalPrice !== undefined) {
    finalPrice = parsePrice(input.finalPrice)
    await assertPriceOverrideAllowed(ctx, existing.listPrice, finalPrice)
  }

  const nextStatus = input.status ?? existing.status

  const sale = await prisma.sale.update({
    where: { id },
    data: {
      ...(input.status !== undefined ? { status: input.status } : {}),
      ...(input.partnerId !== undefined ? { partnerId: input.partnerId } : {}),
      ...(input.finalPrice !== undefined ? { finalPrice } : {}),
      ...(input.paymentMethod !== undefined ? { paymentMethod: input.paymentMethod } : {}),
      ...(input.paymentReference !== undefined ? { paymentReference: input.paymentReference } : {}),
      ...(input.status === 'PENDING_PAYMENT' && !existing.soldAt ? { soldAt: new Date() } : {}),
      ...(nextStatus === 'PAID' ? {} : {}),
    },
    select: saleSelect,
  })

  return serializeSale(sale)
}

export async function confirmSalePayment(
  ctx: AuthorizationContext,
  id: string,
  input: ConfirmPaymentInput,
) {
  const existing = await findSaleScoped(ctx, id)

  if (!canConfirmPayment(existing.status)) {
    throw validationError('Sale must be PENDING_PAYMENT to confirm payment')
  }

  const sale = await prisma.sale.update({
    where: { id },
    data: {
      status: 'PAID',
      paidAt: new Date(),
      paidByUserId: ctx.user.id,
      paymentMethod: input.paymentMethod ?? null,
      paymentReference: input.paymentReference ?? null,
      soldAt: existing.soldAt ?? new Date(),
    },
    select: saleSelect,
  })

  return serializeSale(sale)
}
