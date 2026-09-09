#!/usr/bin/env node
/**
 * Popula estoque na API de produção via PUT /db.
 * Uso: node scripts/seed-production.mjs [baseUrl] [storeSlug]
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const baseUrl = (process.argv[2] || 'https://loja-iphoneimports.vercel.app/api/iphone-imports').replace(/\/$/, '')
const storeSlug = process.argv[3] || 'iphone-imports'
const username = process.env.II_ADMIN_USER || 'admin'
const password = process.env.II_ADMIN_PASS || 'adminimports123'

const seedPath = join(dirname(fileURLToPath(import.meta.url)), '../api/_iphone-imports/seed-data.json')
const seed = JSON.parse(readFileSync(seedPath, 'utf8'))

async function login(slug) {
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, store: slug }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `Login falhou (${res.status})`)
  return data
}

async function pushDb(token, database, version) {
  const res = await fetch(`${baseUrl}/db`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ database, clientVersion: version }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `PUT /db falhou (${res.status})`)
  return data
}

async function main() {
  console.log(`API: ${baseUrl}`)
  console.log(`Loja: ${storeSlug}`)

  let session
  try {
    session = await login(storeSlug)
  } catch (err) {
    console.error('Login com slug fixo falhou:', err.message)
    console.log('Tentando descobrir slug via registro/login sem loja...')
    session = await login('')
  }

  const orgId = session.session.organizationId
  const slug = session.session.organizationSlug || storeSlug
  console.log(`Logado: org=${orgId} slug=${slug}`)

  const database = JSON.parse(JSON.stringify(seed))
  database.organization.id = orgId
  database.organization.slug = slug
  database.stores = database.stores.map((s) => ({ ...s, organizationId: orgId }))
  database.categories = database.categories.map((c) => ({ ...c, organizationId: orgId }))
  database.products = database.products.map((p) => ({ ...p, organizationId: orgId }))
  database.inventory = database.inventory.map((u) => ({
    ...u,
    organizationId: orgId,
    storeId: database.stores[0]?.id || u.storeId,
  }))
  if (database.settings) database.settings.organizationId = orgId

  const result = await pushDb(session.token, database, session.version || 1)
  console.log(`✓ Estoque atualizado: ${database.products.length} produtos, ${database.inventory.length} unidades (v${result.version})`)

  const catalog = await fetch(`${baseUrl}/catalog/${slug}`)
  const cat = await catalog.json()
  console.log(`✓ Catálogo público: ${cat.products?.length ?? 0} produtos visíveis`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
