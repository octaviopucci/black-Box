/**
 * Teste de integração: fluxo completo estoque → catálogo público.
 * Rodar: npx tsx api/_w-tube/integration.test.ts
 */
import assert from 'node:assert/strict'
import { writeFileSync, readFileSync, mkdirSync, rmSync, existsSync } from 'node:fs'
import { buildEmptyStoreDatabase } from './tenant'
import { buildPublicCatalog, getProductStock } from './catalog'
import type { InventoryUnit, OrgDatabase } from './types'

const TEST_FILE = './data/w-tube-integration-test.json'

function unit(id: string, productId: string, storeId: string, status: InventoryUnit['status'] = 'available'): InventoryUnit {
  const now = new Date().toISOString()
  return {
    id,
    organizationId: 'org_test',
    productId,
    storeId,
    status,
    condition: 'novo',
    createdAt: now,
    updatedAt: now,
  }
}

async function run() {
  if (existsSync(TEST_FILE)) rmSync(TEST_FILE)
  mkdirSync('./data', { recursive: true })

  const orgId = 'org_test'
  const userId = 'user_test'
  const db = buildEmptyStoreDatabase({
    orgId,
    orgName: 'Test Store',
    slug: 'test-store',
    userId,
    username: 'admin',
    password: 'test1234',
    ownerName: 'Admin',
  })

  const productId = 'prod_test'
  const storeId = db.stores[0].id
  const categoryId = db.categories[0].id
  const now = new Date().toISOString()

  db.products.push({
    id: productId,
    organizationId: orgId,
    categoryId,
    slug: 'iphone-test',
    name: 'iPhone Test',
    brand: 'Apple',
    description: 'Test',
    shortDescription: 'Test',
    price: 5000,
    images: ['https://example.com/img.jpg'],
    published: true,
    createdAt: now,
    updatedAt: now,
  })

  // 1. Sem estoque → catálogo vazio
  let catalog = buildPublicCatalog(db)
  assert.equal(catalog.products.length, 0, 'passo 1: catálogo vazio')

  // 2. Adiciona 2 unidades → aparece com qty=2
  db.inventory.push(unit('u1', productId, storeId), unit('u2', productId, storeId))
  catalog = buildPublicCatalog(db)
  assert.equal(catalog.products.length, 1, 'passo 2: produto aparece')
  assert.equal(catalog.products[0].stockQuantity, 2)

  // 3. Vende 1 → qty=1
  db.inventory[0].status = 'sold'
  catalog = buildPublicCatalog(db)
  assert.equal(getProductStock(db.inventory, productId), 1, 'passo 3: qty=1')
  assert.equal(catalog.products[0].stockQuantity, 1)

  // 4. Vende última → some do catálogo
  db.inventory[1].status = 'sold'
  catalog = buildPublicCatalog(db)
  assert.equal(catalog.products.length, 0, 'passo 4: esgotado some do catálogo')

  // 5. Persistência em arquivo (simula API)
  // 5. Reentrada após persistência simulada (JSON round-trip)
  db.inventory = [unit('u3', productId, storeId)]
  const persisted = JSON.parse(JSON.stringify(db)) as OrgDatabase
  catalog = buildPublicCatalog(persisted)
  assert.equal(catalog.products.length, 1, 'passo 5: reentrada após persistência funciona')
  assert.equal(catalog.products[0].stockQuantity, 1)

  writeFileSync(TEST_FILE, JSON.stringify(persisted))
  const reloaded = JSON.parse(readFileSync(TEST_FILE, 'utf8')) as OrgDatabase
  assert.equal(getProductStock(reloaded.inventory, productId), 1, 'passo 5b: JSON round-trip ok')
  rmSync(TEST_FILE, { force: true })
  console.log('✓ Teste de integração completo passou (5 passos verificados)')
}

run().catch((err) => {
  console.error('✗ Falha:', err)
  process.exit(1)
})
