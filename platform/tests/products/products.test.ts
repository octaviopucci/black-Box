import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { GET as listProductsGet, POST as createProductPost } from '@/app/api/products/route'
import { GET as getProductGet, PATCH as updateProductPatch } from '@/app/api/products/[id]/route'
import {
  GET as listOffersForProductGet,
  POST as createOfferPost,
} from '@/app/api/products/[id]/offers/route'
import {
  GET as getOfferGet,
} from '@/app/api/products/[id]/offers/[offerId]/route'
import { GET as listAllOffersGet } from '@/app/api/offers/route'
import { clearAuthorizationCacheForTests } from '@/lib/authorization'
import { ROLE_SLUGS } from '@/lib/authorization/roles'
import { resetEnvCache } from '@/config/env'
import { setTestEnv } from '../helpers/env'
import {
  cleanupProductFixtures,
  cookieHeader,
  createOfferDirect,
  createOrganizationWithRbac,
  createProductDirect,
  createUserWithMembership,
  loginSession,
} from './helpers'

function setupEnv() {
  resetEnvCache()
  clearAuthorizationCacheForTests()
  setTestEnv({
    DATABASE_URL:
      process.env.DATABASE_URL ??
      'postgresql://blackbox:blackbox@localhost:5432/blackbox_platform?schema=public',
    NODE_ENV: 'test',
    LOG_LEVEL: 'error',
    AUTH_SECRET: 'test-auth-secret-with-at-least-32-characters',
  })
}

async function adminToken(orgId: string, prefix: string) {
  const { user } = await createUserWithMembership(
    orgId,
    `${prefix}-${Date.now()}@test.local`,
    'Admin',
    ROLE_SLUGS.ADMIN,
  )
  return loginSession(user.id, orgId)
}

describe('products CRUD', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupProductFixtures()
  })

  it('creates product with valid payload', async () => {
    const { org } = await createOrganizationWithRbac('Org Prod', `org-prod-${Date.now()}`)
    const token = await adminToken(org.id, 'admin-prod')

    const res = await createProductPost(
      new Request('http://localhost/api/products', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Landing Page',
          category: 'LANDING_PAGE',
          status: 'DRAFT',
        }),
      }),
    )
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.product.name).toBe('Landing Page')
    expect(body.product.organizationId).toBe(org.id)
    expect(body.product.slug).toBe('landing-page')
  })

  it('lists and filters products', async () => {
    const { org } = await createOrganizationWithRbac('Org List', `org-prod-list-${Date.now()}`)
    await createProductDirect(org.id, { name: 'Website', category: 'WEBSITE', status: 'ACTIVE' })
    await createProductDirect(org.id, { name: 'Other', status: 'DRAFT' })

    const token = await adminToken(org.id, 'admin-list')
    const headers = cookieHeader(token)

    const all = await listProductsGet(new Request('http://localhost/api/products', { headers }))
    expect((await all.json()).total).toBe(2)

    const filtered = await listProductsGet(
      new Request('http://localhost/api/products?status=ACTIVE', { headers }),
    )
    expect((await filtered.json()).products).toHaveLength(1)
  })

  it('updates and activates product', async () => {
    const { org } = await createOrganizationWithRbac('Org Upd', `org-prod-upd-${Date.now()}`)
    const product = await createProductDirect(org.id, { name: 'Before' })
    const token = await adminToken(org.id, 'admin-upd')
    const ctx = { params: Promise.resolve({ id: product.id }) }

    const patchRes = await updateProductPatch(
      new Request(`http://localhost/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'After', status: 'ACTIVE' }),
      }),
      ctx,
    )
    expect(patchRes.status).toBe(200)
    expect((await patchRes.json()).product.status).toBe('ACTIVE')
  })

  it('rejects duplicate slug', async () => {
    const { org } = await createOrganizationWithRbac('Org Slug', `org-prod-slug-${Date.now()}`)
    await createProductDirect(org.id, { name: 'First', slug: 'same-slug' })
    const token = await adminToken(org.id, 'admin-slug')

    const res = await createProductPost(
      new Request('http://localhost/api/products', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Second', slug: 'same-slug' }),
      }),
    )
    expect(res.status).toBe(409)
  })

  it('ignores organizationId in payload', async () => {
    const { org: orgA } = await createOrganizationWithRbac('Org A', `org-prod-a-${Date.now()}`)
    const { org: orgB } = await createOrganizationWithRbac('Org B', `org-prod-b-${Date.now()}`)
    const token = await adminToken(orgA.id, 'admin-payload')

    const res = await createProductPost(
      new Request('http://localhost/api/products', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Spoof', organizationId: orgB.id }),
      }),
    )
    expect(res.status).toBe(201)
    expect((await res.json()).product.organizationId).toBe(orgA.id)
  })
})

describe('offers CRUD', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupProductFixtures()
  })

  it('creates offer for active product', async () => {
    const { org } = await createOrganizationWithRbac('Org Offer', `org-offer-${Date.now()}`)
    const product = await createProductDirect(org.id, { name: 'Product', status: 'ACTIVE' })
    const token = await adminToken(org.id, 'admin-offer')

    const res = await createOfferPost(
      new Request(`http://localhost/api/products/${product.id}/offers`, {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Premium Plan',
          price: 4900,
          currency: 'BRL',
          status: 'ACTIVE',
        }),
      }),
      { params: Promise.resolve({ id: product.id }) },
    )
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.offer.price).toBe('4900')
    expect(body.offer.productId).toBe(product.id)
  })

  it('rejects offer on inactive product', async () => {
    const { org } = await createOrganizationWithRbac('Org Inactive', `org-offer-inactive-${Date.now()}`)
    const product = await createProductDirect(org.id, { name: 'Inactive', status: 'INACTIVE' })
    const token = await adminToken(org.id, 'admin-inactive')

    const res = await createOfferPost(
      new Request(`http://localhost/api/products/${product.id}/offers`, {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Bad Offer', price: 100 }),
      }),
      { params: Promise.resolve({ id: product.id }) },
    )
    expect(res.status).toBe(400)
  })

  it('rejects ACTIVE offer when product is not ACTIVE', async () => {
    const { org } = await createOrganizationWithRbac('Org Draft', `org-offer-draft-${Date.now()}`)
    const product = await createProductDirect(org.id, { name: 'Draft Product', status: 'DRAFT' })
    const token = await adminToken(org.id, 'admin-draft')

    const res = await createOfferPost(
      new Request(`http://localhost/api/products/${product.id}/offers`, {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Active Offer', price: 100, status: 'ACTIVE' }),
      }),
      { params: Promise.resolve({ id: product.id }) },
    )
    expect(res.status).toBe(400)
  })

  it('lists offers globally and per product', async () => {
    const { org } = await createOrganizationWithRbac('Org Offers List', `org-offers-list-${Date.now()}`)
    const product = await createProductDirect(org.id, { name: 'P', status: 'ACTIVE' })
    await createOfferDirect(org.id, product.id, { name: 'Offer 1' })

    const token = await adminToken(org.id, 'admin-offers-list')
    const headers = cookieHeader(token)

    const nested = await listOffersForProductGet(
      new Request(`http://localhost/api/products/${product.id}/offers`, { headers }),
      { params: Promise.resolve({ id: product.id }) },
    )
    expect((await nested.json()).offers).toHaveLength(1)

    const global = await listAllOffersGet(new Request('http://localhost/api/offers', { headers }))
    expect((await global.json()).total).toBe(1)
  })

  it('rejects negative price', async () => {
    const { org } = await createOrganizationWithRbac('Org Price', `org-offer-price-${Date.now()}`)
    const product = await createProductDirect(org.id, { name: 'P', status: 'ACTIVE' })
    const token = await adminToken(org.id, 'admin-price')

    const res = await createOfferPost(
      new Request(`http://localhost/api/products/${product.id}/offers`, {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Bad', price: -1 }),
      }),
      { params: Promise.resolve({ id: product.id }) },
    )
    expect(res.status).toBe(400)
  })
})

describe('catalog tenant isolation', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupProductFixtures()
  })

  it('denies cross-tenant product and offer access', async () => {
    const { org: orgA } = await createOrganizationWithRbac('Org A Cat', `org-cat-a-${Date.now()}`)
    const { org: orgB } = await createOrganizationWithRbac('Org B Cat', `org-cat-b-${Date.now()}`)
    const productB = await createProductDirect(orgB.id, { name: 'Secret Product', status: 'ACTIVE' })
    const offerB = await createOfferDirect(orgB.id, productB.id, { name: 'Secret Offer' })

    const token = await adminToken(orgA.id, 'admin-iso')
    const headers = cookieHeader(token)

    expect(
      (await getProductGet(new Request(`http://localhost/api/products/${productB.id}`, { headers }), {
        params: Promise.resolve({ id: productB.id }),
      })).status,
    ).toBe(404)

    expect(
      (
        await updateProductPatch(
          new Request(`http://localhost/api/products/${productB.id}`, {
            method: 'PATCH',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Hacked' }),
          }),
          { params: Promise.resolve({ id: productB.id }) },
        )
      ).status,
    ).toBe(404)

    expect(
      (
        await listOffersForProductGet(
          new Request(`http://localhost/api/products/${productB.id}/offers`, { headers }),
          { params: Promise.resolve({ id: productB.id }) },
        )
      ).status,
    ).toBe(404)

    expect(
      (
        await createOfferPost(
          new Request(`http://localhost/api/products/${productB.id}/offers`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Intrusion', price: 1 }),
          }),
          { params: Promise.resolve({ id: productB.id }) },
        )
      ).status,
    ).toBe(404)

    expect(
      (
        await getOfferGet(
          new Request(`http://localhost/api/products/${productB.id}/offers/${offerB.id}`, { headers }),
          { params: Promise.resolve({ id: productB.id, offerId: offerB.id }) },
        )
      ).status,
    ).toBe(404)
  })

  it('rejects offer under wrong product path', async () => {
    const { org } = await createOrganizationWithRbac('Org Cross', `org-cross-prod-${Date.now()}`)
    const productA = await createProductDirect(org.id, { name: 'A', status: 'ACTIVE' })
    const productB = await createProductDirect(org.id, { name: 'B', status: 'ACTIVE' })
    const offerA = await createOfferDirect(org.id, productA.id, { name: 'Offer A' })
    const token = await adminToken(org.id, 'admin-cross')

    const res = await getOfferGet(
      new Request(`http://localhost/api/products/${productB.id}/offers/${offerA.id}`, {
        headers: cookieHeader(token),
      }),
      { params: Promise.resolve({ id: productB.id, offerId: offerA.id }) },
    )
    expect(res.status).toBe(404)
  })
})

describe('catalog RBAC', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupProductFixtures()
  })

  it('returns 401 without session', async () => {
    const res = await listProductsGet(new Request('http://localhost/api/products'))
    expect(res.status).toBe(401)
  })

  it('returns 403 without permissions', async () => {
    const { org } = await createOrganizationWithRbac('Org NoPerm', `org-cat-noperm-${Date.now()}`)
    const { user } = await createUserWithMembership(org.id, `noperm-${Date.now()}@test.local`, 'No Role')
    const token = await loginSession(user.id, org.id)
    const headers = cookieHeader(token)

    expect((await listProductsGet(new Request('http://localhost/api/products', { headers }))).status).toBe(403)
    expect((await listAllOffersGet(new Request('http://localhost/api/offers', { headers }))).status).toBe(403)
  })
})
