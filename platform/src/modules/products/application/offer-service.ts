import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { conflictError, validationError } from '@/lib/errors'
import type { AuthorizationContext } from '@/lib/authorization/types'
import {
  findOfferScoped,
  findProductScoped,
  offerSelect,
  orgWhere,
  serializeOffer,
} from '@/modules/products/application/catalog-repository'
import {
  normalizeOptionalText,
  resolveUniqueCatalogSlug,
  slugifyCatalogName,
} from '@/modules/products/domain/normalize'
import type { CreateOfferInput, ListOffersQuery, UpdateOfferInput } from '@/modules/products/schemas/offer.schema'

function validateOfferActivation(productStatus: string, offerStatus: string) {
  if (offerStatus === 'ACTIVE' && productStatus !== 'ACTIVE') {
    throw validationError('Offer cannot be ACTIVE when product is not ACTIVE')
  }
}

export async function createOffer(
  ctx: AuthorizationContext,
  productId: string,
  input: CreateOfferInput,
) {
  const product = await findProductScoped(ctx, productId)
  if (product.status === 'INACTIVE') {
    throw validationError('Inactive product cannot accept new offers')
  }

  const status = input.status ?? 'DRAFT'
  validateOfferActivation(product.status, status)

  const explicitSlug = input.slug !== undefined

  let slug: string
  if (explicitSlug) {
    const baseSlug = slugifyCatalogName(input.slug!)
    if (!baseSlug) throw validationError('Invalid offer slug')
    const taken = await prisma.offer.findFirst({
      where: { organizationId: ctx.organization.id, slug: baseSlug },
    })
    if (taken) {
      throw conflictError('SLUG_ALREADY_EXISTS', 'Offer slug already exists in this organization')
    }
    slug = baseSlug
  } else {
    const baseSlug = slugifyCatalogName(input.name)
    if (!baseSlug) throw validationError('Invalid offer slug')
    slug = await resolveUniqueCatalogSlug(ctx.organization.id, baseSlug, 'offer')
  }

  const offer = await prisma.offer.create({
    data: {
      organizationId: ctx.organization.id,
      productId,
      name: input.name.trim(),
      slug,
      description: normalizeOptionalText(input.description),
      price: new Prisma.Decimal(input.price),
      currency: input.currency ?? 'BRL',
      status,
    },
    select: offerSelect,
  })

  return serializeOffer(offer)
}

export async function listOffersForProduct(ctx: AuthorizationContext, productId: string) {
  await findProductScoped(ctx, productId)
  const offers = await prisma.offer.findMany({
    where: { productId, ...orgWhere(ctx) },
    orderBy: { updatedAt: 'desc' },
    select: offerSelect,
  })
  return offers.map(serializeOffer)
}

export async function listOffers(ctx: AuthorizationContext, query: ListOffersQuery) {
  const search = query.search?.trim()
  const where: Prisma.OfferWhereInput = {
    ...orgWhere(ctx),
    ...(query.status ? { status: query.status } : {}),
    ...(query.productId ? { productId: query.productId } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { product: { name: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {}),
  }

  const skip = (query.page - 1) * query.pageSize
  const [rows, total] = await Promise.all([
    prisma.offer.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: query.pageSize,
      select: offerSelect,
    }),
    prisma.offer.count({ where }),
  ])

  return {
    offers: rows.map(serializeOffer),
    total,
    page: query.page,
    pageSize: query.pageSize,
  }
}

export async function getOffer(
  ctx: AuthorizationContext,
  productId: string,
  offerId: string,
) {
  const offer = await findOfferScoped(ctx, productId, offerId)
  return serializeOffer(offer)
}

export async function updateOffer(
  ctx: AuthorizationContext,
  productId: string,
  offerId: string,
  input: UpdateOfferInput,
) {
  const existing = await findOfferScoped(ctx, productId, offerId)
  const product = await findProductScoped(ctx, productId)

  const nextStatus = input.status ?? existing.status
  validateOfferActivation(product.status, nextStatus)

  let slug = existing.slug
  if (input.slug !== undefined) {
    const baseSlug = slugifyCatalogName(input.slug)
    if (!baseSlug) throw validationError('Invalid offer slug')
    if (baseSlug !== existing.slug) {
      const taken = await prisma.offer.findFirst({
        where: {
          organizationId: ctx.organization.id,
          slug: baseSlug,
          NOT: { id: offerId },
        },
      })
      if (taken) {
        throw conflictError('SLUG_ALREADY_EXISTS', 'Offer slug already exists in this organization')
      }
      slug = baseSlug
    }
  }

  const updated = await prisma.offer.update({
    where: { id: offerId },
    data: {
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.slug !== undefined ? { slug } : {}),
      ...(input.description !== undefined
        ? { description: normalizeOptionalText(input.description) }
        : {}),
      ...(input.price !== undefined ? { price: new Prisma.Decimal(input.price) } : {}),
      ...(input.currency !== undefined ? { currency: input.currency } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
    },
    select: offerSelect,
  })

  return serializeOffer(updated)
}
