import type { CatalogStatus } from '@prisma/client'

export const PRODUCT_CATEGORIES = [
  'WEBSITE',
  'LANDING_PAGE',
  'WEB_APP',
  'SYSTEM',
  'AUTOMATION',
  'AI',
  'MAINTENANCE',
  'OTHER',
] as const

export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number]

export const CATALOG_STATUSES: CatalogStatus[] = ['DRAFT', 'ACTIVE', 'INACTIVE']

export function assertOfferCanBeActive(productStatus: CatalogStatus, offerStatus: CatalogStatus): void {
  if (offerStatus === 'ACTIVE' && productStatus !== 'ACTIVE') {
    throw new Error('Offer cannot be ACTIVE when product is not ACTIVE')
  }
}

export function assertProductAcceptsNewOffers(productStatus: CatalogStatus): void {
  if (productStatus === 'INACTIVE') {
    throw new Error('Inactive product cannot accept new offers')
  }
}
