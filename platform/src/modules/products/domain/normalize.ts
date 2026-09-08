import { slugifyOrganizationName, resolveUniqueSlug } from '@/modules/organization/domain/slug'

export function slugifyCatalogName(name: string): string {
  return slugifyOrganizationName(name)
}

export async function resolveUniqueCatalogSlug(
  organizationId: string,
  baseSlug: string,
  table: 'product' | 'offer',
): Promise<string> {
  const { prisma } = await import('@/lib/db')
  const existing = await (table === 'product'
    ? prisma.product.findMany({
        where: { organizationId },
        select: { slug: true },
      })
    : prisma.offer.findMany({
        where: { organizationId },
        select: { slug: true },
      }))
  const slugs = new Set(existing.map((r) => r.slug))
  return resolveUniqueSlug(baseSlug, slugs)
}

export function normalizeOptionalText(value: string | null | undefined): string | null {
  if (value == null) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}
