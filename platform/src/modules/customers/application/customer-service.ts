import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { conflictError, validationError } from '@/lib/errors'
import type { AuthorizationContext } from '@/lib/authorization/types'
import {
  findCustomerScoped,
  findLeadInTenant,
  findPartnerInTenant,
  orgWhere,
  customerSelect,
  serializeCustomer,
} from '@/modules/sales/application/commercial-repository'
import {
  normalizeCustomerName,
  normalizeDocument,
  normalizeEmail,
  normalizeOptionalText,
  normalizePhone,
} from '@/modules/customers/domain/normalize'
import type {
  CreateCustomerInput,
  ListCustomersQuery,
  UpdateCustomerInput,
} from '@/modules/customers/schemas/customer.schema'

async function assertNoDuplicateCustomer(
  organizationId: string,
  data: { document?: string | null; email?: string | null; leadId?: string | null },
  excludeId?: string,
) {
  if (data.document) {
    const existing = await prisma.customer.findFirst({
      where: {
        organizationId,
        document: data.document,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    })
    if (existing) {
      throw conflictError('MEMBERSHIP_ALREADY_EXISTS', 'Customer with this document already exists')
    }
  }

  if (data.email) {
    const existing = await prisma.customer.findFirst({
      where: {
        organizationId,
        email: data.email,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    })
    if (existing) {
      throw conflictError('MEMBERSHIP_ALREADY_EXISTS', 'Customer with this email already exists')
    }
  }

  if (data.leadId) {
    const existing = await prisma.customer.findFirst({
      where: {
        organizationId,
        leadId: data.leadId,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    })
    if (existing) {
      throw conflictError('MEMBERSHIP_ALREADY_EXISTS', 'Customer already exists for this lead')
    }
  }
}

export async function createCustomer(ctx: AuthorizationContext, input: CreateCustomerInput) {
  const name = normalizeCustomerName(input.name)
  const document = normalizeDocument(input.document)
  const email = normalizeEmail(input.email)
  const phone = normalizePhone(input.phone)

  if (input.leadId) {
    await findLeadInTenant(ctx.organization.id, input.leadId)
  }
  if (input.partnerId) {
    await findPartnerInTenant(ctx.organization.id, input.partnerId)
  }

  await assertNoDuplicateCustomer(ctx.organization.id, {
    document,
    email,
    leadId: input.leadId ?? null,
  })

  try {
    const customer = await prisma.customer.create({
      data: {
        organizationId: ctx.organization.id,
        name,
        legalName: normalizeOptionalText(input.legalName),
        document: document ?? null,
        email: email ?? null,
        phone: phone ?? null,
        companyName: normalizeOptionalText(input.companyName),
        leadId: input.leadId ?? null,
        partnerId: input.partnerId ?? null,
        status: input.status ?? 'ACTIVE',
      },
      select: customerSelect,
    })
    return serializeCustomer(customer)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw conflictError('MEMBERSHIP_ALREADY_EXISTS', 'Customer already exists with these identifiers')
    }
    throw error
  }
}

export async function convertLeadToCustomer(ctx: AuthorizationContext, leadId: string) {
  const lead = await findLeadInTenant(ctx.organization.id, leadId)

  const existing = await prisma.customer.findFirst({
    where: { organizationId: ctx.organization.id, leadId },
    select: customerSelect,
  })
  if (existing) return serializeCustomer(existing)

  const document = normalizeDocument(lead.document)
  const email = normalizeEmail(lead.email)

  await assertNoDuplicateCustomer(ctx.organization.id, { document, email })

  try {
    const customer = await prisma.customer.create({
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
    return serializeCustomer(customer)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const retry = await prisma.customer.findFirst({
        where: { organizationId: ctx.organization.id, leadId },
        select: customerSelect,
      })
      if (retry) return serializeCustomer(retry)
      throw conflictError('MEMBERSHIP_ALREADY_EXISTS', 'Customer already exists with these identifiers')
    }
    throw error
  }
}

export async function listCustomers(ctx: AuthorizationContext, query: ListCustomersQuery) {
  const search = query.search?.trim()
  const where: Prisma.CustomerWhereInput = {
    ...orgWhere(ctx),
    ...(query.status ? { status: query.status } : {}),
    ...(query.partnerId ? { partnerId: query.partnerId } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
            { companyName: { contains: search, mode: 'insensitive' } },
            { document: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  }

  const skip = (query.page - 1) * query.pageSize
  const [rows, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: query.pageSize,
      select: {
        ...customerSelect,
        _count: { select: { sales: true } },
        sales: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { id: true, finalPrice: true, status: true, createdAt: true },
        },
      },
    }),
    prisma.customer.count({ where }),
  ])

  return {
    customers: rows.map((row) => ({
      ...serializeCustomer(row),
      salesCount: row._count.sales,
      lastSale: row.sales[0]
        ? {
            id: row.sales[0].id,
            finalPrice: row.sales[0].finalPrice.toString(),
            status: row.sales[0].status,
            createdAt: row.sales[0].createdAt.toISOString(),
          }
        : null,
    })),
    total,
    page: query.page,
    pageSize: query.pageSize,
  }
}

export async function getCustomer(ctx: AuthorizationContext, id: string) {
  const customer = await findCustomerScoped(ctx, id)

  const [lead, partner, sales] = await Promise.all([
    customer.leadId
      ? prisma.lead.findFirst({
          where: { id: customer.leadId, organizationId: ctx.organization.id },
          select: { id: true, name: true, email: true, companyName: true, source: true },
        })
      : null,
    customer.partnerId
      ? prisma.partner.findFirst({
          where: { id: customer.partnerId, organizationId: ctx.organization.id },
          select: { id: true, name: true },
        })
      : null,
    prisma.sale.findMany({
      where: { customerId: id, ...orgWhere(ctx) },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        status: true,
        offerNameSnapshot: true,
        finalPrice: true,
        currency: true,
        soldAt: true,
        paidAt: true,
        createdAt: true,
      },
    }),
  ])

  return {
    customer: serializeCustomer(customer),
    lead,
    partner,
    sales: sales.map((s) => ({
      ...s,
      finalPrice: s.finalPrice.toString(),
      soldAt: s.soldAt?.toISOString() ?? null,
      paidAt: s.paidAt?.toISOString() ?? null,
      createdAt: s.createdAt.toISOString(),
    })),
  }
}

export async function updateCustomer(
  ctx: AuthorizationContext,
  id: string,
  input: UpdateCustomerInput,
) {
  const existing = await findCustomerScoped(ctx, id)

  const document =
    input.document !== undefined ? normalizeDocument(input.document) : existing.document
  const email = input.email !== undefined ? normalizeEmail(input.email) : existing.email

  if (input.partnerId) {
    await findPartnerInTenant(ctx.organization.id, input.partnerId)
  }

  await assertNoDuplicateCustomer(
    ctx.organization.id,
    { document, email, leadId: existing.leadId },
    id,
  )

  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: normalizeCustomerName(input.name) } : {}),
        ...(input.legalName !== undefined
          ? { legalName: normalizeOptionalText(input.legalName) ?? null }
          : {}),
        ...(input.document !== undefined ? { document: document ?? null } : {}),
        ...(input.email !== undefined ? { email: email ?? null } : {}),
        ...(input.phone !== undefined
          ? { phone: normalizePhone(input.phone) ?? null }
          : {}),
        ...(input.companyName !== undefined
          ? { companyName: normalizeOptionalText(input.companyName) ?? null }
          : {}),
        ...(input.partnerId !== undefined ? { partnerId: input.partnerId } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      },
      select: customerSelect,
    })
    return serializeCustomer(customer)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw conflictError('MEMBERSHIP_ALREADY_EXISTS', 'Customer already exists with these identifiers')
    }
    throw error
  }
}

export async function resolveCustomerForSale(
  ctx: AuthorizationContext,
  input: { customerId?: string; leadId?: string },
) {
  if (input.customerId) {
    const customer = await findCustomerScoped(ctx, input.customerId)
    return customer
  }

  if (input.leadId) {
    const lead = await findLeadInTenant(ctx.organization.id, input.leadId)
    const existing = await prisma.customer.findFirst({
      where: { organizationId: ctx.organization.id, leadId: lead.id },
      select: customerSelect,
    })
    if (existing) return existing

    const document = normalizeDocument(lead.document)
    const email = normalizeEmail(lead.email)
    await assertNoDuplicateCustomer(ctx.organization.id, { document, email })

    return prisma.customer.create({
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

  throw validationError('customerId or leadId is required')
}
