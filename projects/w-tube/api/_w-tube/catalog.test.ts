/**
 * Testes de sincronização estoque ↔ site.
 * Rodar: npx tsx api/_w-tube/catalog.test.ts
 */
import assert from 'node:assert/strict'
import { buildPublicCatalog, getProductStock, getStockByStore } from './catalog'
import type { InventoryUnit, OrgDatabase } from './types'

function makeDb(overrides: Partial<OrgDatabase> = {}): OrgDatabase {
  const now = new Date().toISOString()
  const storeId = 'store_main'
  const productId = 'prod_iphone_15'
  const categoryId = 'cat_1'

  const base: OrgDatabase = {
    version: 1,
    organization: { id: 'org_1', name: 'W-Tube', slug: 'w-tube', createdAt: now },
    stores: [
      { id: storeId, organizationId: 'org_1', name: 'Matriz', active: true, createdAt: now },
      { id: 'store_2', organizationId: 'org_1', name: 'Filial', active: true, createdAt: now },
    ],
    categories: [
      {
        id: categoryId,
        organizationId: 'org_1',
        slug: 'iphones',
        name: 'iPhones',
        description: 'iPhones',
        image: 'https://example.com/img.jpg',
        active: true,
        createdAt: now,
        updatedAt: now,
      },
    ],
    products: [
      {
        id: productId,
        organizationId: 'org_1',
        categoryId,
        slug: 'iphone-15-pro',
        name: 'iPhone 15 Pro',
        brand: 'Apple',
        description: 'Desc',
        shortDescription: 'Short',
        price: 7999,
        images: ['https://example.com/iphone.jpg'],
        published: true,
        createdAt: now,
        updatedAt: now,
      },
    ],
    inventory: [],
    customers: [],
    interactions: [],
    settings: {
      id: 's1',
      organizationId: 'org_1',
      storeName: 'W-Tube',
      whatsapp: '5511999999999',
      updatedAt: now,
    },
    users: [],
    auditLogs: [],
  }

  return { ...base, ...overrides }
}

function unit(
  id: string,
  productId: string,
  storeId: string,
  status: InventoryUnit['status'] = 'available',
): InventoryUnit {
  const now = new Date().toISOString()
  return {
    id,
    organizationId: 'org_1',
    productId,
    storeId,
    status,
    condition: 'novo',
    createdAt: now,
    updatedAt: now,
  }
}

// 1. Sem estoque → produto não aparece no catálogo
{
  const db = makeDb()
  const catalog = buildPublicCatalog(db)
  assert.equal(catalog.products.length, 0, 'catálogo vazio sem estoque')
}

// 2. Entrada de 1 unidade → aparece no site com qty=1
{
  const productId = 'prod_iphone_15'
  const db = makeDb({
    inventory: [unit('u1', productId, 'store_main')],
  })
  const catalog = buildPublicCatalog(db)
  assert.equal(catalog.products.length, 1, '1 produto no catálogo')
  assert.equal(catalog.products[0].stockQuantity, 1)
  assert.equal(catalog.products[0].stock, true)
}

// 3. Entrada de 3 unidades → qty=3
{
  const productId = 'prod_iphone_15'
  const db = makeDb({
    inventory: [
      unit('u1', productId, 'store_main'),
      unit('u2', productId, 'store_main'),
      unit('u3', productId, 'store_2'),
    ],
  })
  assert.equal(getProductStock(db.inventory, productId), 3)
  const catalog = buildPublicCatalog(db)
  assert.equal(catalog.products[0].stockQuantity, 3)
}

// 4. Estoque separado por loja
{
  const productId = 'prod_iphone_15'
  const db = makeDb({
    inventory: [
      unit('u1', productId, 'store_main'),
      unit('u2', productId, 'store_2'),
      unit('u3', productId, 'store_2'),
    ],
  })
  const byStore = getStockByStore(db.inventory, productId)
  assert.equal(byStore.store_main, 1)
  assert.equal(byStore.store_2, 2)
  assert.equal(getProductStock(db.inventory, productId, 'store_main'), 1)
}

// 5. Saída parcial (vendido) → qty reduz
{
  const productId = 'prod_iphone_15'
  const db = makeDb({
    inventory: [
      unit('u1', productId, 'store_main', 'sold'),
      unit('u2', productId, 'store_main', 'available'),
    ],
  })
  const catalog = buildPublicCatalog(db)
  assert.equal(catalog.products[0].stockQuantity, 1)
}

// 6. Zerou estoque → some do catálogo
{
  const productId = 'prod_iphone_15'
  const db = makeDb({
    inventory: [unit('u1', productId, 'store_main', 'sold')],
  })
  const catalog = buildPublicCatalog(db)
  assert.equal(catalog.products.length, 0, 'produto esgotado não listado')
}

// 7. Loja inativa não conta estoque
{
  const productId = 'prod_iphone_15'
  const db = makeDb({
    stores: [
      {
        id: 'store_main',
        organizationId: 'org_1',
        name: 'Matriz',
        active: false,
        createdAt: new Date().toISOString(),
      },
    ],
    inventory: [unit('u1', productId, 'store_main')],
  })
  const catalog = buildPublicCatalog(db)
  assert.equal(catalog.products.length, 0, 'loja inativa não expõe estoque')
}

// 8. Produto não publicado não aparece mesmo com estoque
{
  const productId = 'prod_iphone_15'
  const base = makeDb()
  const db = makeDb({
    products: [{ ...base.products[0], published: false }],
    inventory: [unit('u1', productId, 'store_main')],
  })
  const catalog = buildPublicCatalog(db)
  assert.equal(catalog.products.length, 0)
}

console.log('✓ Todos os 8 testes de sincronização estoque ↔ site passaram')
