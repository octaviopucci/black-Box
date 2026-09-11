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
  images: string[]
  colors?: string[]
  storage?: string[]
  featured?: boolean
  bestSeller?: boolean
  new?: boolean
  sale?: boolean
  published: boolean
  specs?: Record<string, string>
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
  soldAt?: string
  customerId?: string
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
  createdAt: string
}

export interface StoreSettings {
  id: string
  organizationId: string
  storeName: string
  whatsapp: string
  hours?: string
  topBarMessage?: string
  promoBarMessage?: string
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
  auditLogs: unknown[]
}
