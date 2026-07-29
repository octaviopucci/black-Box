import catalog from './catalog.json'

export type Transaction = 'sale' | 'rent'

export interface AreaItem {
  title: string
  value: string
}

export interface Characteristic {
  title: string
  quantity: number | null
}

export interface Property {
  id: string
  slug: string
  reference: string
  title: string
  fullTitle: string
  address: string
  street: string
  price: string
  totalPrice: string
  cashPrice: string
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
  areas: AreaItem[]
  image: string
  images: string[]
  description: string
  characteristics: Characteristic[]
  profile: string
  situation: string
  isFinanceable: boolean
  lat: number | null
  lng: number | null
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

export function getPropertyBySlug(slug: string) {
  return properties.find((p) => p.slug === slug || p.reference === slug || p.id === slug)
}

export function relatedProperties(property: Property, limit = 3) {
  return properties
    .filter((p) => p.id !== property.id && p.transaction === property.transaction)
    .slice(0, limit)
}
