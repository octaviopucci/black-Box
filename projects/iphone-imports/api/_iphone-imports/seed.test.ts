/**
 * Garante que o seed não apaga catálogo vazio sincronizado pelo gestor.
 * Rodar: npx tsx api/_iphone-imports/seed.test.ts
 */
import assert from 'node:assert/strict'
import { JsonStore } from './store'
import { ensureIphoneImportsStore, ORG_ID, STORE_SLUG } from './seed'
import type { OrgDatabase } from './types'

async function run() {
  JsonStore.resetCache()
  const store = await JsonStore.open()

  await ensureIphoneImportsStore(store, { force: true })
  const first = store.data().databases[ORG_ID]?.data as OrgDatabase
  assert.ok(first.products.length > 0, 'seed inicial deve ter produtos')

  // Simula gestor com produto novo mas sem estoque
  const custom: OrgDatabase = {
    ...first,
    version: 99,
    products: [
      ...first.products,
      {
        id: 'prod_custom',
        organizationId: ORG_ID,
        categoryId: first.categories[0].id,
        slug: 'iphone-custom-gestor',
        name: 'iPhone Custom Gestor',
        brand: 'Apple',
        description: 'Teste',
        shortDescription: 'Teste',
        price: 9999,
        images: ['https://example.com/x.jpg'],
        published: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    inventory: [],
  }

  store.data().databases[ORG_ID] = {
    version: 100,
    updatedAt: new Date().toISOString(),
    data: custom,
  }
  store.markDirty()
  await store.persist()

  JsonStore.resetCache()
  const reloaded = await JsonStore.open()
  const result = await ensureIphoneImportsStore(reloaded)
  const db = reloaded.data().databases[ORG_ID]?.data as OrgDatabase

  assert.equal(result.created, false, 'não deve re-seed com DB existente')
  assert.equal(db.products.some((p) => p.slug === 'iphone-custom-gestor'), true, 'produto do gestor preservado')
  assert.equal(db.inventory.length, 0, 'estoque vazio preservado')
  assert.equal(reloaded.findOrgBySlug(STORE_SLUG)?.slug, STORE_SLUG)

  console.log('✓ Seed não apaga dados do gestor')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
