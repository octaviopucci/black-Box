import {
  properties,
  type Property,
  type Transaction,
} from '../data/properties'

export type PropertyKind =
  | 'Todos'
  | 'Casa'
  | 'Sobrado'
  | 'Sítio'
  | 'Fazenda'
  | 'Área'
  | 'Apartamento'
  | 'Comercial'
  | 'Terreno'

export const propertyKinds: PropertyKind[] = [
  'Todos',
  'Casa',
  'Sobrado',
  'Sítio',
  'Fazenda',
  'Área',
  'Apartamento',
  'Comercial',
  'Terreno',
]

export function inferKind(property: Property): PropertyKind {
  const t = `${property.title} ${property.fullTitle}`.toLowerCase()

  if (t.includes('fazenda')) return 'Fazenda'
  if (t.includes('sítio') || t.includes('sitio') || t.includes('chácara') || t.includes('chacara'))
    return 'Sítio'
  if (t.includes('sobrado')) return 'Sobrado'
  if (t.includes('apto') || t.includes('apartamento')) return 'Apartamento'
  if (t.includes('terreno')) return 'Terreno'
  if (
    t.includes('loja') ||
    t.includes('ponto') ||
    t.includes('sala comercial') ||
    t.includes('galpão') ||
    t.includes('galpao') ||
    t.includes('prédio') ||
    t.includes('predio') ||
    t.includes('salão') ||
    t.includes('salao')
  ) {
    return 'Comercial'
  }
  if (t.includes('área') || t.includes('area') || t.includes('hotel')) return 'Área'
  if (t.includes('casa')) return 'Casa'
  if (property.profile === 'Comercial' || property.profile === 'Residencial/Comercial')
    return 'Comercial'
  if (property.profile === 'Rural') return 'Sítio'
  return 'Casa'
}

export function extractCity(address: string) {
  const part = address.split('-').pop()?.trim() || address
  return part.replace(/,.*/, '').trim()
}

export function listCities() {
  const set = new Set<string>()
  for (const p of properties) {
    const city = extractCity(p.address)
    if (city) set.add(city)
  }
  return ['Todas', ...Array.from(set).sort((a, b) => a.localeCompare(b, 'pt-BR'))]
}

export type FilterState = {
  query: string
  kind: PropertyKind
  city: string
  transaction: Transaction | 'all'
  profile: string
}

export const defaultFilters: FilterState = {
  query: '',
  kind: 'Todos',
  city: 'Todas',
  transaction: 'all',
  profile: 'Todos',
}

export function filterProperties(filters: FilterState, source: Property[] = properties) {
  const q = filters.query.trim().toLowerCase()
  return source.filter((p) => {
    const matchQ =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.fullTitle.toLowerCase().includes(q) ||
      p.address.toLowerCase().includes(q) ||
      p.reference.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    const matchKind = filters.kind === 'Todos' || inferKind(p) === filters.kind
    const matchCity = filters.city === 'Todas' || p.address.includes(filters.city)
    const matchTx = filters.transaction === 'all' || p.transaction === filters.transaction
    const matchProfile = filters.profile === 'Todos' || p.profile === filters.profile
    return matchQ && matchKind && matchCity && matchTx && matchProfile
  })
}

export function cleanTitle(title: string) {
  return title.replace(/…$/, '').replace(/\s+/g, ' ').trim()
}
