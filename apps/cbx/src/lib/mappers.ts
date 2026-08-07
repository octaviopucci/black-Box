import { slugify } from '@/lib/utils'
import type { Product as ApiProduct, User as ApiUser, Category as ApiCategory, PlanTier, AdStatus, ProductCondition } from '@/types'
import type { Product, User, Category, PlanTier as DbPlan, AdStatus as DbStatus, ProductCondition as DbCondition } from '@prisma/client'

export function toApiUser(u: User): ApiUser {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    avatar: u.avatar || `https://api.dicebear.com/9.x/notionists/svg?seed=${u.id}&backgroundColor=ede9fe`,
    city: u.city,
    state: u.state,
    bio: u.bio ?? undefined,
    verified: u.verified,
    phoneVerified: u.phoneVerified,
    memberSince: u.createdAt.toISOString(),
    plan: u.plan as PlanTier,
    rating: u.rating,
    reviewCount: u.reviewCount,
    salesCount: u.salesCount,
    adsCount: u.adsCount,
  }
}

export function toApiCategory(c: Category): ApiCategory {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    color: c.color,
    productCount: c.productCount,
    image: c.image,
  }
}

export function toApiProduct(p: Product): ApiProduct {
  const specs =
    p.specs && typeof p.specs === 'object' && !Array.isArray(p.specs)
      ? (p.specs as Record<string, string>)
      : {}

  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    description: p.description,
    price: p.price,
    oldPrice: p.oldPrice ?? undefined,
    condition: p.condition as ProductCondition,
    images: p.images,
    categoryId: p.categoryId,
    sellerId: p.sellerId,
    storeId: p.storeId ?? undefined,
    city: p.city,
    neighborhood: p.neighborhood,
    createdAt: p.createdAt.toISOString(),
    views: p.views,
    favorites: p.favoritesCount,
    status: p.status as AdStatus,
    sponsored: p.sponsored,
    featured: p.featured,
    tags: p.tags,
    specs,
    location: { lat: p.lat, lng: p.lng },
  }
}

export function makeProductSlug(title: string): string {
  return `${slugify(title)}-${Date.now().toString(36)}`
}

export type { DbPlan, DbStatus, DbCondition }
