/** Tipos do banco por organização (loja cliente). */

export type InventoryStatus = 'available' | 'reserved' | 'sold' | 'maintenance'
export type DeviceCondition = 'novo' | 'seminovo' | 'usado'
export type CrmInteractionType = 'whatsapp' | 'call' | 'visit' | 'sale' | 'note'

export interface StoreLocation {
  id: string
  organizationId: string
  name: string
  address?: string
  city?: string
  phone?: string
  active: boolean
  createdAt: string
}

export interface CategoryRecord {
  id: string
  organizationId: string
  slug: string
  name: string
  description: string
  image: string
  featured?: boolean
  keywords?: string[]
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface CatalogProduct {
  id: string
  organizationId: string
  categoryId: string
  slug: string
  name: string
  brand: string
  description: string
  shortDescription: string
  price: number
  oldPrice?: number
  installment?: string
  images: string[]
  colors?: string[]
  storage?: string[]
  featured?: boolean
  bestSeller?: boolean
  new?: boolean
  sale?: boolean
  published: boolean
  specs?: Record<string, string>
  keywords?: string[]
  inBox?: string[]
  warranty?: string
  createdAt: string
  updatedAt: string
}

export interface InventoryUnit {
  id: string
  organizationId: string
  productId: string
  storeId: string
  status: InventoryStatus
  imei?: string
  serialNumber?: string
  color?: string
  storage?: string
  batteryHealth?: number
  condition: DeviceCondition
  purchasePrice?: number
  salePrice?: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CustomerRecord {
  id: string
  organizationId: string
  name: string
  phone: string
  email?: string
  city?: string
  notes?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export interface CrmInteraction {
  id: string
  organizationId: string
  customerId: string
  type: CrmInteractionType
  description: string
  userId?: string
  createdAt: string
}

export interface StoreSettings {
  id: string
  organizationId: string
  storeName: string
  whatsapp: string
  instagram?: string
  email?: string
  address?: string
  city?: string
  state?: string
  hours?: string
  topBarMessage?: string
  promoBarMessage?: string
  siteUrl?: string
  updatedAt: string
}

export interface GestorUser {
  id: string
  organizationId: string
  username: string
  password: string
  nome: string
  role: 'admin' | 'vendedor' | 'estoquista'
  active: boolean
  createdAt: string
}

export interface AuditLog {
  id: string
  organizationId: string
  userId: string
  username: string
  action: string
  entityType: string
  entityId: string
  detail: string
  createdAt: string
}

export interface OrganizationRecord {
  id: string
  name: string
  slug: string
  createdAt: string
}

export interface OrgDatabase {
  version: number
  organization: OrganizationRecord
  stores: StoreLocation[]
  categories: CategoryRecord[]
  products: CatalogProduct[]
  inventory: InventoryUnit[]
  customers: CustomerRecord[]
  interactions: CrmInteraction[]
  settings: StoreSettings
  users: GestorUser[]
  auditLogs: AuditLog[]
}

/** Produto exposto no site (estoque calculado). */
export interface PublicCatalogProduct {
  id: string
  slug: string
  name: string
  category: string
  categorySlug: string
  brand: string
  description: string
  shortDescription: string
  price: number
  oldPrice?: number
  installment?: string
  images: string[]
  colors?: string[]
  storage?: string[]
  featured?: boolean
  bestSeller?: boolean
  new?: boolean
  sale?: boolean
  stock: boolean
  stockQuantity: number
  specs?: Record<string, string>
  keywords?: string[]
  inBox?: string[]
  warranty?: string
}

export interface PublicCatalogResponse {
  storeName: string
  storeSlug: string
  whatsapp: string
  hours?: string
  topBarMessage?: string
  promoBarMessage?: string
  categories: Array<{
    slug: string
    name: string
    description: string
    image: string
    featured?: boolean
  }>
  products: PublicCatalogProduct[]
  generatedAt: string
}
