import { prisma } from '@/lib/db'
import {
  cleanupRbacFixtures,
  createOrganizationWithRbac,
  createUserWithMembership,
} from '../authorization/helpers'
import { createLeadDirect, createPartnerDirect } from '../leads/helpers'
import { createProductDirect, createOfferDirect } from '../products/helpers'
import { ensurePipeline, createOpportunityDirect } from '../crm/helpers'

export { cleanupRbacFixtures as cleanupSalesFixtures }
export { createOrganizationWithRbac, createUserWithMembership, createLeadDirect, createPartnerDirect }

export async function createCustomerDirect(
  organizationId: string,
  data: {
    name: string
    leadId?: string
    partnerId?: string
    email?: string
    document?: string
    status?: 'ACTIVE' | 'INACTIVE'
  },
) {
  return prisma.customer.create({
    data: {
      organizationId,
      name: data.name,
      leadId: data.leadId ?? null,
      partnerId: data.partnerId ?? null,
      email: data.email ?? null,
      document: data.document ?? null,
      status: data.status ?? 'ACTIVE',
    },
  })
}

export async function createSaleDirect(
  organizationId: string,
  data: {
    customerId: string
    productId: string
    offerId: string
    listPrice?: string
    finalPrice?: string
    status?: 'DRAFT' | 'PENDING_PAYMENT' | 'PAID' | 'CANCELED'
    leadId?: string
    partnerId?: string
    opportunityId?: string
    productNameSnapshot?: string
    offerNameSnapshot?: string
  },
) {
  const { Prisma } = await import('@prisma/client')
  return prisma.sale.create({
    data: {
      organizationId,
      customerId: data.customerId,
      productId: data.productId,
      offerId: data.offerId,
      leadId: data.leadId ?? null,
      partnerId: data.partnerId ?? null,
      opportunityId: data.opportunityId ?? null,
      status: data.status ?? 'DRAFT',
      productNameSnapshot: data.productNameSnapshot ?? 'Product',
      offerNameSnapshot: data.offerNameSnapshot ?? 'Offer',
      listPrice: new Prisma.Decimal(data.listPrice ?? '1000'),
      finalPrice: new Prisma.Decimal(data.finalPrice ?? data.listPrice ?? '1000'),
      currency: 'BRL',
    },
  })
}

export async function setupSellableCatalog(orgId: string) {
  const product = await createProductDirect(orgId, { name: 'Landing Page', status: 'ACTIVE' })
  const offer = await createOfferDirect(orgId, product.id, {
    name: 'Landing Premium',
    price: '4900',
    status: 'ACTIVE',
  })
  return { product, offer }
}

export { ensurePipeline, createOpportunityDirect, createProductDirect, createOfferDirect }

function cookieHeader(token: string) {
  return { cookie: `bb_session=${token}` }
}

export { cookieHeader }

export async function loginSession(userId: string, orgId: string) {
  const { createSession } = await import('@/modules/auth/infrastructure/session-repository')
  const { token } = await createSession(userId, orgId)
  return token
}
