import { prisma } from '@/lib/db'
import {
  cleanupRbacFixtures,
  createOrganizationWithRbac,
  createUserWithMembership,
} from '../authorization/helpers'

export { cleanupRbacFixtures as cleanupProductFixtures }

export { createOrganizationWithRbac, createUserWithMembership }

export async function createProductDirect(
  organizationId: string,
  data: {
    name: string
    slug?: string
    status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE'
    category?: string
  },
) {
  const slug = data.slug ?? data.name.toLowerCase().replace(/\s+/g, '-')
  return prisma.product.create({
    data: {
      organizationId,
      name: data.name,
      slug,
      category: data.category ?? null,
      status: data.status ?? 'DRAFT',
    },
  })
}

export async function createOfferDirect(
  organizationId: string,
  productId: string,
  data: {
    name: string
    slug?: string
    price?: string
    status?: 'DRAFT' | 'ACTIVE' | 'INACTIVE'
  },
) {
  const { Prisma } = await import('@prisma/client')
  const slug = data.slug ?? data.name.toLowerCase().replace(/\s+/g, '-')
  return prisma.offer.create({
    data: {
      organizationId,
      productId,
      name: data.name,
      slug,
      price: new Prisma.Decimal(data.price ?? '100'),
      currency: 'BRL',
      status: data.status ?? 'DRAFT',
    },
  })
}

function cookieHeader(token: string) {
  return { cookie: `bb_session=${token}` }
}

export { cookieHeader }

export async function loginSession(userId: string, orgId: string) {
  const { createSession } = await import('@/modules/auth/infrastructure/session-repository')
  const { token } = await createSession(userId, orgId)
  return token
}
