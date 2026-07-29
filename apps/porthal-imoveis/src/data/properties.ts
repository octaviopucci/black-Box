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
export const rawHighlights = catalog.highlights as Highlight[]

export const saleProperties = properties.filter((p) => p.transaction === 'sale')
export const rentProperties = properties.filter((p) => p.transaction === 'rent')
export const ruralProperties = properties.filter(
  (p) =>
    p.profile === 'Rural' ||
    /s[ií]tio|ch[aá]cara|fazenda/i.test(`${p.title} ${p.fullTitle}`),
)

export const highlights: Highlight[] = rawHighlights.map((h) => {
  if (h.slug) return h
  const match =
    properties.find((p) => p.image === h.image) ||
    properties.find((p) => p.reference === '961') ||
    ruralProperties[0]
  return { ...h, slug: match?.slug ?? '' }
})

export function getPropertyBySlug(slug: string) {
  return properties.find((p) => p.slug === slug || p.reference === slug || p.id === slug)
}

export function relatedProperties(property: Property, limit = 3) {
  return properties
    .filter(
      (p) =>
        p.id !== property.id &&
        (p.transaction === property.transaction || p.profile === property.profile),
    )
    .sort((a, b) => {
      const aScore = (a.profile === property.profile ? 2 : 0) + (a.transaction === property.transaction ? 1 : 0)
      const bScore = (b.profile === property.profile ? 2 : 0) + (b.transaction === property.transaction ? 1 : 0)
      return bScore - aScore
    })
    .slice(0, limit)
}

export const profiles = ['Todos', ...Array.from(new Set(properties.map((p) => p.profile))).sort()]
