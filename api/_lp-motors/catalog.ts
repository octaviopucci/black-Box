/** Catálogo público LP Motors — veículos prontos para venda no site. */

export type VehicleStatus =
  | 'negociacao'
  | 'comprado'
  | 'documentacao'
  | 'preparacao'
  | 'pronto'
  | 'anunciado'
  | 'reservado'
  | 'vendido'
  | 'entregue'
  | 'cancelado'
  | 'disponivel'
  | 'consignado'
  | 'oficina'
  | 'financiado'

export interface LpVehicle {
  id: string
  organizationId?: string
  codigoInterno: string
  marca: string
  modelo: string
  versao: string
  ano: number
  anoModelo: number
  cor: string
  combustivel: string
  cambio: string
  quilometragem: number
  cidade: string
  estado: string
  precoAnunciado: number
  observacoes: string
  fotos: string[]
  fotoPrincipal: number
  status: VehicleStatus
  archived: boolean
  draft: boolean
  consignado: boolean
}

export interface LpSettings {
  nomeEmpresa?: string
  nomeCurto?: string
  telefone?: string
  whatsapp?: string
  instagram?: string
  endereco?: string
  cidade?: string
}

export interface LpOrgDatabase {
  organization?: { id?: string; name?: string; slug?: string }
  vehicles: LpVehicle[]
  settings?: LpSettings[]
}

export interface PublicCatalogVehicle {
  id: string
  slug: string
  title: string
  brand: string
  model: string
  version: string
  year: number
  price: number
  transmission: string
  fuel: string
  mileage: number
  color: string
  city: string
  state: string
  images: string[]
  image: string
  highlights: string[]
  description: string
  internalCode: string
}

export interface PublicCatalogResponse {
  storeName: string
  storeSlug: string
  whatsapp: string
  phone: string
  instagram: string
  address: string
  city: string
  vehicles: PublicCatalogVehicle[]
  generatedAt: string
}

const FUEL_LABELS: Record<string, string> = {
  flex: 'Flex',
  gasolina: 'Gasolina',
  etanol: 'Etanol',
  diesel: 'Diesel',
  eletrico: 'Elétrico',
  hibrido: 'Híbrido',
  gnv: 'GNV',
}

const TRANSMISSION_LABELS: Record<string, string> = {
  manual: 'Manual',
  automatico: 'Automático',
  cvt: 'CVT',
  automatizado: 'Automatizado',
}

/** Status que entram na vitrine do site (pronto para venda / anunciado). */
const SITE_VISIBLE_STATUSES = new Set<VehicleStatus>(['pronto', 'anunciado', 'disponivel'])

export function normalizeStatus(status: VehicleStatus): VehicleStatus {
  switch (status) {
    case 'disponivel':
      return 'pronto'
    case 'oficina':
      return 'preparacao'
    case 'consignado':
    case 'financiado':
      return 'anunciado'
    default:
      return status
  }
}

/** Veículo visível no site: pronto/anunciado, não rascunho, não arquivado. */
export function isSiteVisibleVehicle(vehicle: Pick<LpVehicle, 'status' | 'archived' | 'draft'>): boolean {
  if (vehicle.archived || vehicle.draft) return false
  const normalized = normalizeStatus(vehicle.status)
  if (normalized === 'pronto' || normalized === 'anunciado') return true
  return SITE_VISIBLE_STATUSES.has(vehicle.status)
}

function slugify(parts: string[]): string {
  return parts
    .join('-')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function vehicleTitle(v: LpVehicle): string {
  const parts = [v.marca, v.modelo, v.versao, String(v.anoModelo || v.ano)].filter(Boolean)
  return parts.join(' ').trim() || v.codigoInterno
}

function pickImages(v: LpVehicle): string[] {
  const fotos = (v.fotos || []).filter((f) => typeof f === 'string' && f.length > 0)
  if (fotos.length === 0) return []
  const idx = Math.min(Math.max(0, v.fotoPrincipal ?? 0), fotos.length - 1)
  const primary = fotos[idx]
  const rest = fotos.filter((_, i) => i !== idx)
  return [primary, ...rest]
}

function toPublicVehicle(v: LpVehicle): PublicCatalogVehicle {
  const images = pickImages(v)
  const title = vehicleTitle(v)
  const fuel = FUEL_LABELS[v.combustivel] || v.combustivel || ''
  const transmission = TRANSMISSION_LABELS[v.cambio] || v.cambio || ''

  return {
    id: v.id,
    slug: slugify([v.marca, v.modelo, String(v.anoModelo || v.ano), v.id.slice(-6)]),
    title,
    brand: v.marca,
    model: v.modelo,
    version: v.versao || '',
    year: v.anoModelo || v.ano,
    price: v.precoAnunciado || 0,
    transmission,
    fuel,
    mileage: v.quilometragem || 0,
    color: v.cor || '',
    city: v.cidade || '',
    state: v.estado || '',
    images,
    image: images[0] || '',
    highlights: [transmission, fuel, v.cor].filter(Boolean),
    description: v.observacoes || `${title} disponível na loja.`,
    internalCode: v.codigoInterno,
  }
}

function readSettings(db: LpOrgDatabase): LpSettings {
  const row = db.settings?.[0]
  return row || {}
}

/**
 * Catálogo público do site.
 * Só veículos com status pronto/anunciado (disponível para venda) — exclui oficina, preparação, etc.
 */
export function buildPublicCatalog(db: LpOrgDatabase, orgSlug: string): PublicCatalogResponse {
  const settings = readSettings(db)
  const storeName =
    settings.nomeEmpresa || db.organization?.name || 'LP Motors'
  const vehicles = (db.vehicles || [])
    .filter(isSiteVisibleVehicle)
    .filter((v) => (v.precoAnunciado || 0) > 0 || pickImages(v).length > 0)
    .map(toPublicVehicle)
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title, 'pt-BR'))

  const whatsappRaw = String(settings.whatsapp || settings.telefone || '').replace(/\D/g, '')

  return {
    storeName,
    storeSlug: orgSlug,
    whatsapp: whatsappRaw,
    phone: settings.telefone || '',
    instagram: settings.instagram || '',
    address: settings.endereco || '',
    city: settings.cidade || '',
    vehicles,
    generatedAt: new Date().toISOString(),
  }
}

export function getPublicVehicleById(
  db: LpOrgDatabase,
  orgSlug: string,
  vehicleId: string,
): PublicCatalogVehicle | null {
  const catalog = buildPublicCatalog(db, orgSlug)
  return catalog.vehicles.find((v) => v.id === vehicleId || v.slug === vehicleId) || null
}
