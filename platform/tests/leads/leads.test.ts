import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { GET as listLeadsGet, POST as createLeadPost } from '@/app/api/leads/route'
import { GET as getLeadGet, PATCH as updateLeadPatch } from '@/app/api/leads/[id]/route'
import {
  GET as listInteractionsGet,
  POST as createInteractionPost,
} from '@/app/api/leads/[id]/interactions/route'
import { clearAuthorizationCacheForTests } from '@/lib/authorization'
import { ROLE_SLUGS } from '@/lib/authorization/roles'
import { resetEnvCache } from '@/config/env'
import { setTestEnv } from '../helpers/env'
import {
  cleanupLeadFixtures,
  cookieHeader,
  createLeadDirect,
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

describe('leads CRUD', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupLeadFixtures()
  })

  it('creates lead with valid payload', async () => {
    const { org } = await createOrganizationWithRbac('Org Lead', `org-lead-${Date.now()}`)
    const { user } = await createUserWithMembership(
      org.id,
      `admin-lead-${Date.now()}@test.local`,
      'Admin',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, org.id)

    const res = await createLeadPost(
      new Request('http://localhost/api/leads', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Maria Silva',
          companyName: 'Acme Ltd',
          email: 'maria@acme.test',
          source: 'referral',
        }),
      }),
    )

    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.lead.name).toBe('Maria Silva')
    expect(body.lead.organizationId).toBe(org.id)
  })

  it('rejects missing name', async () => {
    const { org } = await createOrganizationWithRbac('Org Val', `org-lead-val-${Date.now()}`)
    const { user } = await createUserWithMembership(
      org.id,
      `admin-val-${Date.now()}@test.local`,
      'Admin',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, org.id)

    const res = await createLeadPost(
      new Request('http://localhost/api/leads', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '' }),
      }),
    )
    expect(res.status).toBe(400)
  })

  it('lists leads scoped to organization', async () => {
    const { org: orgA } = await createOrganizationWithRbac('Org A Leads', `org-a-leads-${Date.now()}`)
    const { org: orgB } = await createOrganizationWithRbac('Org B Leads', `org-b-leads-${Date.now()}`)

    await createLeadDirect(orgA.id, { name: 'Lead A' })
    await createLeadDirect(orgB.id, { name: 'Lead B' })

    const { user } = await createUserWithMembership(
      orgA.id,
      `admin-list-${Date.now()}@test.local`,
      'Admin',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, orgA.id)

    const res = await listLeadsGet(
      new Request('http://localhost/api/leads', { headers: cookieHeader(token) }),
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.leads).toHaveLength(1)
    expect(body.leads[0].name).toBe('Lead A')
  })

  it('ignores organizationId in payload', async () => {
    const { org: orgA } = await createOrganizationWithRbac('Org Payload', `org-lead-payload-${Date.now()}`)
    const { org: orgB } = await createOrganizationWithRbac('Org Payload B', `org-lead-payload-b-${Date.now()}`)

    const { user } = await createUserWithMembership(
      orgA.id,
      `admin-payload-${Date.now()}@test.local`,
      'Admin',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, orgA.id)

    const res = await createLeadPost(
      new Request('http://localhost/api/leads', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Spoof Lead', organizationId: orgB.id }),
      }),
    )
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.lead.organizationId).toBe(orgA.id)
  })

  it('searches by name and email', async () => {
    const { org } = await createOrganizationWithRbac('Org Search', `org-search-${Date.now()}`)
    await createLeadDirect(org.id, { name: 'Unique Name XYZ', email: 'findme@test.local' })
    await createLeadDirect(org.id, { name: 'Other Lead' })

    const { user } = await createUserWithMembership(
      org.id,
      `admin-search-${Date.now()}@test.local`,
      'Admin',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, org.id)

    const res = await listLeadsGet(
      new Request('http://localhost/api/leads?search=findme', {
        headers: cookieHeader(token),
      }),
    )
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.leads).toHaveLength(1)
    expect(body.leads[0].email).toBe('findme@test.local')
  })

  it('filters by partnerId and source', async () => {
    const { org } = await createOrganizationWithRbac('Org Filter', `org-filter-${Date.now()}`)
    const partner = await createPartnerDirect(org.id, { name: 'Filter Partner' })
    await createLeadDirect(org.id, { name: 'With Partner', partnerId: partner.id, source: 'web' })
    await createLeadDirect(org.id, { name: 'No Partner', source: 'event' })

    const { user } = await createUserWithMembership(
      org.id,
      `admin-filter-${Date.now()}@test.local`,
      'Admin',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, org.id)

    const byPartner = await listLeadsGet(
      new Request(`http://localhost/api/leads?partnerId=${partner.id}`, {
        headers: cookieHeader(token),
      }),
    )
    expect((await byPartner.json()).leads).toHaveLength(1)

    const bySource = await listLeadsGet(
      new Request('http://localhost/api/leads?source=event', { headers: cookieHeader(token) }),
    )
    expect((await bySource.json()).leads).toHaveLength(1)
  })
})

describe('leads tenant isolation', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupLeadFixtures()
  })

  it('denies cross-tenant GET/PATCH and interactions', async () => {
    const { org: orgA } = await createOrganizationWithRbac('Org A ISO', `org-a-iso-${Date.now()}`)
    const { org: orgB } = await createOrganizationWithRbac('Org B ISO', `org-b-iso-${Date.now()}`)

    const leadB = await createLeadDirect(orgB.id, { name: 'Secret Lead B' })

    const { user } = await createUserWithMembership(
      orgA.id,
      `admin-iso-${Date.now()}@test.local`,
      'Admin A',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, orgA.id)
    const headers = cookieHeader(token)
    const ctx = { params: Promise.resolve({ id: leadB.id }) }

    expect((await getLeadGet(new Request(`http://localhost/api/leads/${leadB.id}`, { headers }), ctx)).status).toBe(404)

    expect(
      (
        await updateLeadPatch(
          new Request(`http://localhost/api/leads/${leadB.id}`, {
            method: 'PATCH',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Hacked' }),
          }),
          ctx,
        )
      ).status,
    ).toBe(404)

    expect(
      (await listInteractionsGet(new Request(`http://localhost/api/leads/${leadB.id}/interactions`, { headers }), ctx)).status,
    ).toBe(404)

    expect(
      (
        await createInteractionPost(
          new Request(`http://localhost/api/leads/${leadB.id}/interactions`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'NOTE', description: 'Intrusion' }),
          }),
          ctx,
        )
      ).status,
    ).toBe(404)

    const unchanged = await prisma.lead.findUnique({ where: { id: leadB.id } })
    expect(unchanged?.name).toBe('Secret Lead B')
  })
})

describe('leads partner association', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupLeadFixtures()
  })

  it('allows partner from same organization', async () => {
    const { org } = await createOrganizationWithRbac('Org Link', `org-lead-link-${Date.now()}`)
    const partner = await createPartnerDirect(org.id, { name: 'Partner Link' })

    const { user } = await createUserWithMembership(
      org.id,
      `admin-link-${Date.now()}@test.local`,
      'Admin',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, org.id)

    const res = await createLeadPost(
      new Request('http://localhost/api/leads', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Linked Lead', partnerId: partner.id }),
      }),
    )
    expect(res.status).toBe(201)
    expect((await res.json()).lead.partnerId).toBe(partner.id)
  })

  it('rejects partner from another organization', async () => {
    const { org: orgA } = await createOrganizationWithRbac('Org Link A', `org-link-a-${Date.now()}`)
    const { org: orgB } = await createOrganizationWithRbac('Org Link B', `org-link-b-${Date.now()}`)
    const partnerB = await createPartnerDirect(orgB.id, { name: 'Partner B' })

    const { user } = await createUserWithMembership(
      orgA.id,
      `admin-link-a-${Date.now()}@test.local`,
      'Admin',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, orgA.id)

    const res = await createLeadPost(
      new Request('http://localhost/api/leads', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Bad Link', partnerId: partnerB.id }),
      }),
    )
    expect(res.status).toBe(400)
  })
})

describe('leads RBAC', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupLeadFixtures()
  })

  it('returns 401 without session', async () => {
    const res = await listLeadsGet(new Request('http://localhost/api/leads'))
    expect(res.status).toBe(401)
  })

  it('GESTOR can create leads', async () => {
    const { org } = await createOrganizationWithRbac('Org Gestor', `org-gestor-lead-${Date.now()}`)
    const { user } = await createUserWithMembership(
      org.id,
      `gestor-${Date.now()}@test.local`,
      'Gestor',
      ROLE_SLUGS.GESTOR,
    )
    const token = await loginSession(user.id, org.id)

    const res = await createLeadPost(
      new Request('http://localhost/api/leads', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Gestor Lead' }),
      }),
    )
    expect(res.status).toBe(201)
  })
})

describe('lead interactions', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupLeadFixtures()
  })

  it('creates and lists interactions', async () => {
    const { org } = await createOrganizationWithRbac('Org Int', `org-int-${Date.now()}`)
    const lead = await createLeadDirect(org.id, { name: 'Interaction Lead' })

    const { user } = await createUserWithMembership(
      org.id,
      `admin-int-${Date.now()}@test.local`,
      'Admin',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, org.id)
    const headers = { ...cookieHeader(token), 'Content-Type': 'application/json' }
    const ctx = { params: Promise.resolve({ id: lead.id }) }

    const createRes = await createInteractionPost(
      new Request(`http://localhost/api/leads/${lead.id}/interactions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ type: 'CALL', description: 'Initial contact call' }),
      }),
      ctx,
    )
    expect(createRes.status).toBe(201)
    const created = await createRes.json()
    expect(created.interaction.type).toBe('CALL')
    expect(created.interaction.createdByUserId).toBe(user.id)

    const listRes = await listInteractionsGet(
      new Request(`http://localhost/api/leads/${lead.id}/interactions`, {
        headers: cookieHeader(token),
      }),
      ctx,
    )
    expect(listRes.status).toBe(200)
    expect((await listRes.json()).interactions).toHaveLength(1)
  })

  it('rejects empty interaction description', async () => {
    const { org } = await createOrganizationWithRbac('Org Int Val', `org-int-val-${Date.now()}`)
    const lead = await createLeadDirect(org.id, { name: 'Val Lead' })
    const { user } = await createUserWithMembership(
      org.id,
      `admin-int-val-${Date.now()}@test.local`,
      'Admin',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, org.id)

    const res = await createInteractionPost(
      new Request(`http://localhost/api/leads/${lead.id}/interactions`, {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'NOTE', description: '' }),
      }),
      { params: Promise.resolve({ id: lead.id }) },
    )
    expect(res.status).toBe(400)
  })
})
