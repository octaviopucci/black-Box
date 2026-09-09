import { writeFileSync } from 'node:fs'
import { register } from 'tsx/esm/api'

register()

const { products } = await import('../src/data/products.ts')
const { categories } = await import('../src/data/categories.ts')

const ORG_ID = 'org_iphone_imports'
const STORE_ID = 'store_matriz'
const USER_ID = 'user_admin'
const now = new Date().toISOString()

const catRecords = categories.map((c) => ({
  id: `cat_${c.slug}`,
  organizationId: ORG_ID,
  slug: c.slug,
  name: c.name,
  description: c.description,
  image: c.image,
  featured: c.featured ?? false,
  active: true,
  createdAt: now,
  updatedAt: now,
}))

const catalogProducts = products.map((p) => {
  const cat = catRecords.find((c) => c.slug === p.categorySlug)
  return {
    id: `prod_${p.id}`,
    organizationId: ORG_ID,
    categoryId: cat?.id || 'cat_iphones',
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    description: p.description,
    shortDescription: p.shortDescription,
    price: p.price,
    oldPrice: p.oldPrice,
    installment: p.installment,
    images: p.images,
    colors: p.colors,
    storage: p.storage,
    featured: p.featured,
    bestSeller: p.bestSeller,
    new: p.new,
    sale: p.sale,
    published: true,
    specs: p.specs,
    keywords: p.keywords,
    inBox: p.inBox,
    warranty: p.warranty,
    createdAt: now,
    updatedAt: now,
  }
})

const inventory = products
  .filter((p) => p.stock)
  .map((p) => ({
    id: `unit_${p.id}`,
    organizationId: ORG_ID,
    productId: `prod_${p.id}`,
    storeId: STORE_ID,
    status: 'available',
    condition: 'novo',
    color: p.colors?.[0],
    storage: p.storage?.[0],
    createdAt: now,
    updatedAt: now,
  }))

const db = {
  version: 1,
  organization: { id: ORG_ID, name: 'iPhone Imports', slug: 'iphone-imports', createdAt: now },
  stores: [
    {
      id: STORE_ID,
      organizationId: ORG_ID,
      name: 'iPhone Imports — Matriz',
      active: true,
      createdAt: now,
    },
  ],
  categories: catRecords,
  products: catalogProducts,
  inventory,
  customers: [],
  interactions: [],
  settings: {
    id: 'settings_default',
    organizationId: ORG_ID,
    storeName: 'iPhone Imports',
    whatsapp: '5511999999999',
    hours: 'Seg–Sex 9h–18h · Sáb 9h–13h',
    topBarMessage: '🔥 Ofertas especiais toda semana • Atendimento rápido pelo WhatsApp',
    promoBarMessage: '🔥 Semana iPhone Imports — confira nossas ofertas',
    updatedAt: now,
  },
  users: [
    {
      id: USER_ID,
      organizationId: ORG_ID,
      username: 'admin',
      password: 'adminimports123',
      nome: 'Administrador',
      role: 'admin',
      active: true,
      createdAt: now,
    },
  ],
  auditLogs: [],
}

writeFileSync('api/_iphone-imports/seed-data.json', JSON.stringify(db, null, 2))
console.log(`✓ seed-data.json: ${catalogProducts.length} produtos, ${inventory.length} unidades`)
