import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { GET as listPartnersGet, POST as createPartnerPost } from '@/app/api/partners/route'
import { GET as getPartnerGet, PATCH as updatePartnerPatch } from '@/app/api/partners/[id]/route'
import { POST as activatePartnerPost } from '@/app/api/partners/[id]/activate/route'
import { POST as deactivatePartnerPost } from '@/app/api/partners/[id]/deactivate/route'
import { clearAuthorizationCacheForTests } from '@/lib/authorization'
import { ROLE_SLUGS } from '@/lib/authorization/roles'
import { resetEnvCache } from '@/config/env'
import { setTestEnv } from '../helpers/env'
import {
  cleanupPartnerFixtures,
  cookieHeader,
  createOrganizationWithRbac,
  createPartnerDirect,
  createUserWithMembership,
  loginSession,
} from './helpers'
import { prisma } from '@/lib/db'

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

describe('partners CRUD', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupPartnerFixtures()
  })

  it('creates partner with valid payload', async () => {
    const { org } = await createOrganizationWithRbac('Org CRUD', `org-crud-${Date.now()}`)
    const { user } = await createUserWithMembership(
      org.id,
      `admin-crud-${Date.now()}@test.local`,
      'Admin',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, org.id)

    const res = await createPartnerPost(
      new Request('http://localhost/api/partners', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Partner Alpha', email: 'alpha@test.local' }),
      }),
    )

    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.partner.name).toBe('Partner Alpha')
    expect(body.partner.status).toBe('PENDING')
    expect(body.partner.organizationId).toBe(org.id)
  })

  it('rejects invalid name', async () => {
    const { org } = await createOrganizationWithRbac('Org Val', `org-val-${Date.now()}`)
    const { user } = await createUserWithMembership(
      org.id,
      `admin-val-${Date.now()}@test.local`,
      'Admin',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, org.id)

    const res = await createPartnerPost(
      new Request('http://localhost/api/partners', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '' }),
      }),
    )

    expect(res.status).toBe(400)
  })

  it('lists only partners from active organization', async () => {
    const { org: orgA } = await createOrganizationWithRbac('Org A List', `org-a-list-${Date.now()}`)
    const { org: orgB } = await createOrganizationWithRbac('Org B List', `org-b-list-${Date.now()}`)

    await createPartnerDirect(orgA.id, { name: 'Partner A' })
    await createPartnerDirect(orgB.id, { name: 'Partner B' })

    const { user } = await createUserWithMembership(
      orgA.id,
      `admin-list-${Date.now()}@test.local`,
      'Admin',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, orgA.id)

    const res = await listPartnersGet(
      new Request('http://localhost/api/partners', { headers: cookieHeader(token) }),
    )

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.partners).toHaveLength(1)
    expect(body.partners[0].name).toBe('Partner A')
  })

  it('ignores organizationId in create payload', async () => {
    const { org: orgA } = await createOrganizationWithRbac('Org Payload', `org-payload-${Date.now()}`)
    const { org: orgB } = await createOrganizationWithRbac('Org Payload B', `org-payload-b-${Date.now()}`)

    const { user } = await createUserWithMembership(
      orgA.id,
      `admin-payload-${Date.now()}@test.local`,
      'Admin',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, orgA.id)

    const res = await createPartnerPost(
      new Request('http://localhost/api/partners', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Spoof Test', organizationId: orgB.id }),
      }),
    )

    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.partner.organizationId).toBe(orgA.id)
  })
})

describe('partners tenant isolation (IDOR)', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupPartnerFixtures()
  })

  it('denies cross-tenant GET/PATCH/ACTIVATE/DEACTIVATE', async () => {
    const { org: orgA } = await createOrganizationWithRbac('Org A IDOR', `org-a-idor-${Date.now()}`)
    const { org: orgB } = await createOrganizationWithRbac('Org B IDOR', `org-b-idor-${Date.now()}`)

    const partnerB = await createPartnerDirect(orgB.id, { name: 'Partner B Secret' })

    const { user } = await createUserWithMembership(
      orgA.id,
      `admin-idor-${Date.now()}@test.local`,
      'Admin A',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, orgA.id)
    const headers = cookieHeader(token)

    const getRes = await getPartnerGet(
      new Request(`http://localhost/api/partners/${partnerB.id}`, { headers }),
      { params: Promise.resolve({ id: partnerB.id }) },
    )
    expect(getRes.status).toBe(404)

    const patchRes = await updatePartnerPatch(
      new Request(`http://localhost/api/partners/${partnerB.id}`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Hacked' }),
      }),
      { params: Promise.resolve({ id: partnerB.id }) },
    )
    expect(patchRes.status).toBe(404)

    const activateRes = await activatePartnerPost(
      new Request(`http://localhost/api/partners/${partnerB.id}/activate`, {
        method: 'POST',
        headers,
      }),
      { params: Promise.resolve({ id: partnerB.id }) },
    )
    expect(activateRes.status).toBe(404)

    const deactivateRes = await deactivatePartnerPost(
      new Request(`http://localhost/api/partners/${partnerB.id}/deactivate`, {
        method: 'POST',
        headers,
      }),
      { params: Promise.resolve({ id: partnerB.id }) },
    )
    expect(deactivateRes.status).toBe(404)

    const unchanged = await prisma.partner.findUnique({ where: { id: partnerB.id } })
    expect(unchanged?.name).toBe('Partner B Secret')
  })
})

describe('partners RBAC', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupPartnerFixtures()
  })

  it('returns 401 without session', async () => {
    const res = await listPartnersGet(new Request('http://localhost/api/partners'))
    expect(res.status).toBe(401)
  })

  it('ADMIN can read and create partners', async () => {
    const { org } = await createOrganizationWithRbac('Org RBAC Admin', `org-rbac-admin-${Date.now()}`)
    const { user } = await createUserWithMembership(
      org.id,
      `admin-rbac-${Date.now()}@test.local`,
      'Admin',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, org.id)
    const headers = cookieHeader(token)

    expect((await listPartnersGet(new Request('http://localhost/api/partners', { headers }))).status).toBe(200)
    expect(
      (
        await createPartnerPost(
          new Request('http://localhost/api/partners', {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'RBAC Partner' }),
          }),
        )
      ).status,
    ).toBe(201)
  })

  it('GESTOR can create when permission granted', async () => {
    const { org } = await createOrganizationWithRbac('Org RBAC Gestor', `org-rbac-gestor-${Date.now()}`)
    const { user } = await createUserWithMembership(
      org.id,
      `gestor-rbac-${Date.now()}@test.local`,
      'Gestor',
      ROLE_SLUGS.GESTOR,
    )
    const token = await loginSession(user.id, org.id)

    const res = await createPartnerPost(
      new Request('http://localhost/api/partners', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Gestor Partner' }),
      }),
    )
    expect(res.status).toBe(201)
  })

  it('PARCEIRO cannot create partners', async () => {
    const { org } = await createOrganizationWithRbac('Org RBAC Parceiro', `org-rbac-parceiro-${Date.now()}`)
    const { user } = await createUserWithMembership(
      org.id,
      `parceiro-rbac-${Date.now()}@test.local`,
      'Parceiro',
      ROLE_SLUGS.PARCEIRO,
    )
    const token = await loginSession(user.id, org.id)

    const res = await createPartnerPost(
      new Request('http://localhost/api/partners', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Blocked' }),
      }),
    )
    expect(res.status).toBe(403)
  })
})

describe('partners user association', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupPartnerFixtures()
  })

  it('allows linking user from same tenant', async () => {
    const { org } = await createOrganizationWithRbac('Org Link', `org-link-${Date.now()}`)
    const { user: admin } = await createUserWithMembership(
      org.id,
      `admin-link-${Date.now()}@test.local`,
      'Admin',
      ROLE_SLUGS.ADMIN,
    )
    const { user: member } = await createUserWithMembership(
      org.id,
      `member-link-${Date.now()}@test.local`,
      'Member',
    )

    const token = await loginSession(admin.id, org.id)
    const res = await createPartnerPost(
      new Request('http://localhost/api/partners', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Linked Partner', userId: member.id }),
      }),
    )

    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.partner.userId).toBe(member.id)
  })

  it('denies linking user from another tenant', async () => {
    const { org: orgA } = await createOrganizationWithRbac('Org Link A', `org-link-a-${Date.now()}`)
    const { org: orgB } = await createOrganizationWithRbac('Org Link B', `org-link-b-${Date.now()}`)

    const { user: adminA } = await createUserWithMembership(
      orgA.id,
      `admin-link-a-${Date.now()}@test.local`,
      'Admin A',
      ROLE_SLUGS.ADMIN,
    )
    const { user: userB } = await createUserWithMembership(
      orgB.id,
      `user-b-${Date.now()}@test.local`,
      'User B',
    )

    const token = await loginSession(adminA.id, orgA.id)
    const res = await createPartnerPost(
      new Request('http://localhost/api/partners', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Cross Tenant Link', userId: userB.id }),
      }),
    )

    expect(res.status).toBe(400)
  })
})

describe('partners status transitions', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupPartnerFixtures()
  })

  it('activates PENDING partner and deactivates ACTIVE partner', async () => {
    const { org } = await createOrganizationWithRbac('Org Status', `org-status-${Date.now()}`)
    const partner = await createPartnerDirect(org.id, { name: 'Status Partner', status: 'PENDING' })

    const { user } = await createUserWithMembership(
      org.id,
      `admin-status-${Date.now()}@test.local`,
      'Admin',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, org.id)
    const headers = cookieHeader(token)

    const activateRes = await activatePartnerPost(
      new Request(`http://localhost/api/partners/${partner.id}/activate`, {
        method: 'POST',
        headers,
      }),
      { params: Promise.resolve({ id: partner.id }) },
    )
    expect(activateRes.status).toBe(200)
    expect((await activateRes.json()).partner.status).toBe('ACTIVE')

    const deactivateRes = await deactivatePartnerPost(
      new Request(`http://localhost/api/partners/${partner.id}/deactivate`, {
        method: 'POST',
        headers,
      }),
      { params: Promise.resolve({ id: partner.id }) },
    )
    expect(deactivateRes.status).toBe(200)
    expect((await deactivateRes.json()).partner.status).toBe('INACTIVE')
  })

  it('reactivates INACTIVE partner', async () => {
    const { org } = await createOrganizationWithRbac('Org Reactivate', `org-reactivate-${Date.now()}`)
    const partner = await createPartnerDirect(org.id, { name: 'Inactive Partner', status: 'INACTIVE' })

    const { user } = await createUserWithMembership(
      org.id,
      `admin-reactivate-${Date.now()}@test.local`,
      'Admin',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, org.id)

    const res = await activatePartnerPost(
      new Request(`http://localhost/api/partners/${partner.id}/activate`, {
        method: 'POST',
        headers: cookieHeader(token),
      }),
      { params: Promise.resolve({ id: partner.id }) },
    )
    expect(res.status).toBe(200)
    expect((await res.json()).partner.status).toBe('ACTIVE')
  })
})

describe('partner domain', () => {
  it('validates status transitions', async () => {
    const { assertValidStatusTransition } = await import('@/modules/partners/domain/partner-status')
    expect(() => assertValidStatusTransition('PENDING', 'ACTIVE')).not.toThrow()
    expect(() => assertValidStatusTransition('ACTIVE', 'PENDING')).toThrow()
  })
})
