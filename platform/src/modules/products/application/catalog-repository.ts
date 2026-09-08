import type { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { notFoundError } from '@/lib/errors'
import type { AuthorizationContext } from '@/lib/authorization/types'

export function orgWhere(ctx: AuthorizationContext): { organizationId: string } {
  return { organizationId: ctx.organization.id }
}

export async function findProductScoped(ctx: AuthorizationContext, id: string) {
  const product = await prisma.product.findFirst({
    where: { id, ...orgWhere(ctx) },
    include: { _count: { select: { offers: true } } },
  })
  if (!product) throw notFoundError()
  return product
}

export async function findOfferScoped(
  ctx: AuthorizationContext,
  productId: string,
  offerId: string,
) {
  const offer = await prisma.offer.findFirst({
    where: {
      id: offerId,
      productId,
      ...orgWhere(ctx),
    },
    include: { product: { select: { id: true, name: true, status: true } } },
  })
  if (!offer) throw notFoundError()
  return offer
}

export async function findOfferScopedById(ctx: AuthorizationContext, offerId: string) {
  const offer = await prisma.offer.findFirst({
    where: { id: offerId, ...orgWhere(ctx) },
    include: { product: { select: { id: true, name: true, status: true } } },
  })
  if (!offer) throw notFoundError()
  return offer
}

export const productSelect = {
  id: true,
  organizationId: true,
  name: true,
  slug: true,
  description: true,
  category: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  _count: { select: { offers: true } },
} satisfies Prisma.ProductSelect

export const offerSelect = {
  id: true,
  organizationId: true,
  productId: true,
  name: true,
  slug: true,
  description: true,
  price: true,
  currency: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  product: { select: { id: true, name: true, status: true } },
} satisfies Prisma.OfferSelect

export function serializeProduct(
  row: Prisma.ProductGetPayload<{ select: typeof productSelect }>,
) {
  const { _count, createdAt, updatedAt, ...rest } = row
  return {
    ...rest,
    offerCount: _count.offers,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  }
}

export function serializeOffer(row: Prisma.OfferGetPayload<{ select: typeof offerSelect }>) {
  return {
    ...row,
    price: row.price.toString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  }
}
