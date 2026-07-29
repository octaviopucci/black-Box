import catalog from './catalog.json'

export type Transaction = 'sale' | 'rent'

export interface Property {
  id: string
  slug: string
  reference: string
  title: string
  fullTitle: string
  address: string
  street: string
  city: string
  price: string
  totalPrice: string
  cashPrice: string
  amount: number | null
  previousPrice: string | null
  condominiumPrice: string | null
  iptu: string | null
  transaction: Transaction
  bedrooms: string
  garages: string
  bathrooms: string
  bedroomCount: number | null
  garageCount: number | null
  bathroomCount: number | null
  area: string
  areas: { title: string; value: string }[]
  image: string
  images: string[]
  description: string
  characteristics: { title: string; quantity: number | null }[]
  profile: string
  situation: string
  isFinanceable: boolean
  lat: number | null
  lng: number | null
  featured: boolean
  originalUrl?: string
}

export interface Highlight {
  title: string
  description: string
  image: string
  slug: string
}

export const properties = catalog.properties as Property[]
export const highlights = catalog.highlights as Highlight[]
export const saleProperties = properties.filter((p) => p.transaction === 'sale')
export const rentProperties = properties.filter((p) => p.transaction === 'rent')
export const featuredProperties = properties.filter((p) => p.featured)

export function getPropertyBySlug(slug: string) {
  return properties.find((p) => p.slug === slug || p.reference === slug || p.id === slug)
}

export function relatedProperties(property: Property, limit = 3) {
  return properties
    .filter((p) => p.id !== property.id && p.transaction === property.transaction)
    .slice(0, limit)
}

export function filterProperties(opts: {
  transaction?: 'all' | Transaction
  city?: string
  query?: string
  minBeds?: number
}) {
  return properties.filter((p) => {
    if (opts.transaction && opts.transaction !== 'all' && p.transaction !== opts.transaction) {
      return false
    }
    if (opts.city && opts.city !== 'all' && !p.city.toLowerCase().includes(opts.city.toLowerCase())) {
      return false
    }
    if (opts.minBeds && (p.bedroomCount ?? 0) < opts.minBeds) return false
    if (opts.query) {
      const q = opts.query.toLowerCase()
      const hay = `${p.title} ${p.fullTitle} ${p.city} ${p.address} ${p.reference}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}
