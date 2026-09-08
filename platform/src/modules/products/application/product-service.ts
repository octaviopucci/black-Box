import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { conflictError, validationError } from '@/lib/errors'
import type { AuthorizationContext } from '@/lib/authorization/types'
import {
  findProductScoped,
  orgWhere,
  productSelect,
  serializeProduct,
} from '@/modules/products/application/catalog-repository'
import {
  normalizeOptionalText,
  resolveUniqueCatalogSlug,
  slugifyCatalogName,
} from '@/modules/products/domain/normalize'
import type { CreateProductInput, ListProductsQuery, UpdateProductInput } from '@/modules/products/schemas/product.schema'

export async function createProduct(ctx: AuthorizationContext, input: CreateProductInput) {
  const explicitSlug = input.slug !== undefined

  let slug: string
  if (explicitSlug) {
    const baseSlug = slugifyCatalogName(input.slug!)
    if (!baseSlug) throw validationError('Invalid product slug')
    const taken = await prisma.product.findFirst({
      where: { organizationId: ctx.organization.id, slug: baseSlug },
    })
    if (taken) {
      throw conflictError('SLUG_ALREADY_EXISTS', 'Product slug already exists in this organization')
    }
    slug = baseSlug
  } else {
    const baseSlug = slugifyCatalogName(input.name)
    if (!baseSlug) throw validationError('Invalid product slug')
    slug = await resolveUniqueCatalogSlug(ctx.organization.id, baseSlug, 'product')
  }

  const product = await prisma.product.create({
    data: {
      organizationId: ctx.organization.id,
      name: input.name.trim(),
      slug,
      description: normalizeOptionalText(input.description),
      category: input.category ?? null,
      status: input.status ?? 'DRAFT',
    },
    select: productSelect,
  })

  return serializeProduct(product)
}

export async function listProducts(ctx: AuthorizationContext, query: ListProductsQuery) {
  const search = query.search?.trim()
  const where: Prisma.ProductWhereInput = {
    ...orgWhere(ctx),
    ...(query.status ? { status: query.status } : {}),
    ...(query.category ? { category: query.category } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  }

  const skip = (query.page - 1) * query.pageSize
  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: query.pageSize,
      select: productSelect,
    }),
    prisma.product.count({ where }),
  ])

  return {
    products: rows.map(serializeProduct),
    total,
    page: query.page,
    pageSize: query.pageSize,
  }
}

export async function getProduct(ctx: AuthorizationContext, id: string) {
  const product = await findProductScoped(ctx, id)
  return serializeProduct(product)
}

export async function updateProduct(
  ctx: AuthorizationContext,
  id: string,
  input: UpdateProductInput,
) {
  const existing = await findProductScoped(ctx, id)

  let slug = existing.slug
  if (input.slug !== undefined) {
    const baseSlug = slugifyCatalogName(input.slug)
    if (!baseSlug) throw validationError('Invalid product slug')
    if (baseSlug !== existing.slug) {
      const taken = await prisma.product.findFirst({
        where: {
          organizationId: ctx.organization.id,
          slug: baseSlug,
          NOT: { id },
        },
      })
      if (taken) {
        throw conflictError('SLUG_ALREADY_EXISTS', 'Product slug already exists in this organization')
      }
      slug = baseSlug
    }
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.slug !== undefined ? { slug } : {}),
      ...(input.description !== undefined
        ? { description: normalizeOptionalText(input.description) }
        : {}),
      ...(input.category !== undefined ? { category: input.category } : {}),
      ...(input.status !== undefined ? { status: input.status } : {}),
    },
    select: productSelect,
  })

  return serializeProduct(updated)
}
