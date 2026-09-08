import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  GET as listOpportunitiesGet,
  POST as createOpportunityPost,
} from '@/app/api/crm/opportunities/route'
import {
  GET as getOpportunityGet,
  PATCH as updateOpportunityPatch,
} from '@/app/api/crm/opportunities/[id]/route'
import { POST as moveOpportunityPost } from '@/app/api/crm/opportunities/[id]/move/route'
import {
  GET as listCrmInteractionsGet,
  POST as createCrmInteractionPost,
} from '@/app/api/crm/opportunities/[id]/interactions/route'
import {
  GET as listPipelinesGet,
  POST as createPipelinePost,
} from '@/app/api/crm/pipelines/route'
import { PATCH as updatePipelinePatch } from '@/app/api/crm/pipelines/[id]/route'
import { POST as createStagePost } from '@/app/api/crm/pipelines/[id]/stages/route'
import { PATCH as updateStagePatch } from '@/app/api/crm/pipelines/[id]/stages/[stageId]/route'
import { clearAuthorizationCacheForTests } from '@/lib/authorization'
import { ROLE_SLUGS } from '@/lib/authorization/roles'
import { resetEnvCache } from '@/config/env'
import { setTestEnv } from '../helpers/env'
import { prisma } from '@/lib/db'
import {
  cleanupCrmFixtures,
  cookieHeader,
  createLeadDirect,
  createOpportunityDirect,
  createOrganizationWithRbac,
  createPartnerDirect,
  createUserWithMembership,
  ensurePipeline,
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

describe('CRM opportunities CRUD', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupCrmFixtures()
  })

  it('creates opportunity from lead with default pipeline', async () => {
    const { org } = await createOrganizationWithRbac('Org CRM', `org-crm-${Date.now()}`)
    const lead = await createLeadDirect(org.id, { name: 'CRM Lead', companyName: 'Acme' })
    const token = await adminToken(org.id, 'admin-crm')

    const res = await createOpportunityPost(
      new Request('http://localhost/api/crm/opportunities', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id, title: 'Deal Acme', amount: 15000, probability: 40 }),
      }),
    )

    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.opportunity.title).toBe('Deal Acme')
    expect(body.opportunity.leadId).toBe(lead.id)
    expect(body.opportunity.organizationId).toBe(org.id)
    expect(body.opportunity.amount).toBe('15000')
    expect(body.opportunity.pipelineId).toBeTruthy()
    expect(body.opportunity.stageId).toBeTruthy()

    const history = await prisma.opportunityStageHistory.findMany({
      where: { opportunityId: body.opportunity.id },
    })
    expect(history).toHaveLength(1)
    expect(history[0].fromStageId).toBeNull()
  })

  it('lists and filters opportunities', async () => {
    const { org } = await createOrganizationWithRbac('Org List', `org-crm-list-${Date.now()}`)
    const { pipelineId, stages } = await ensurePipeline(org.id)
    const partner = await createPartnerDirect(org.id, { name: 'List Partner' })
    const leadA = await createLeadDirect(org.id, {
      name: 'Searchable Name',
      email: 'find@crm.test',
      partnerId: partner.id,
    })
    const leadB = await createLeadDirect(org.id, { name: 'Other Lead' })
    await createOpportunityDirect(org.id, {
      leadId: leadA.id,
      pipelineId,
      stageId: stages[0]!.id,
      title: 'Opp A',
      partnerId: partner.id,
    })
    await createOpportunityDirect(org.id, {
      leadId: leadB.id,
      pipelineId,
      stageId: stages[1]!.id,
      title: 'Opp B',
    })

    const token = await adminToken(org.id, 'admin-list')
    const headers = cookieHeader(token)

    const all = await listOpportunitiesGet(new Request('http://localhost/api/crm/opportunities', { headers }))
    expect((await all.json()).total).toBe(2)

    const bySearch = await listOpportunitiesGet(
      new Request('http://localhost/api/crm/opportunities?search=find@crm', { headers }),
    )
    expect((await bySearch.json()).opportunities).toHaveLength(1)

    const byPartner = await listOpportunitiesGet(
      new Request(`http://localhost/api/crm/opportunities?partnerId=${partner.id}`, { headers }),
    )
    expect((await byPartner.json()).opportunities).toHaveLength(1)

    const byStage = await listOpportunitiesGet(
      new Request(`http://localhost/api/crm/opportunities?stageId=${stages[1]!.id}`, { headers }),
    )
    expect((await byStage.json()).opportunities).toHaveLength(1)
  })

  it('gets and updates opportunity', async () => {
    const { org } = await createOrganizationWithRbac('Org Upd', `org-crm-upd-${Date.now()}`)
    const { pipelineId, stages } = await ensurePipeline(org.id)
    const lead = await createLeadDirect(org.id, { name: 'Upd Lead' })
    const opp = await createOpportunityDirect(org.id, {
      leadId: lead.id,
      pipelineId,
      stageId: stages[0]!.id,
      title: 'Before',
    })

    const token = await adminToken(org.id, 'admin-upd')
    const headers = { ...cookieHeader(token), 'Content-Type': 'application/json' }
    const ctx = { params: Promise.resolve({ id: opp.id }) }

    const getRes = await getOpportunityGet(
      new Request(`http://localhost/api/crm/opportunities/${opp.id}`, { headers: cookieHeader(token) }),
      ctx,
    )
    expect(getRes.status).toBe(200)
    const detail = await getRes.json()
    expect(detail.opportunity.title).toBe('Before')
    expect(Array.isArray(detail.stageHistory)).toBe(true)

    const patchRes = await updateOpportunityPatch(
      new Request(`http://localhost/api/crm/opportunities/${opp.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ title: 'After', probability: 75 }),
      }),
      ctx,
    )
    expect(patchRes.status).toBe(200)
    expect((await patchRes.json()).opportunity.title).toBe('After')
  })

  it('ignores organizationId in payload', async () => {
    const { org: orgA } = await createOrganizationWithRbac('Org Payload', `org-crm-payload-a-${Date.now()}`)
    const { org: orgB } = await createOrganizationWithRbac('Org Payload B', `org-crm-payload-b-${Date.now()}`)
    const lead = await createLeadDirect(orgA.id, { name: 'Payload Lead' })
    const token = await adminToken(orgA.id, 'admin-payload')

    const res = await createOpportunityPost(
      new Request('http://localhost/api/crm/opportunities', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id, title: 'Spoof', organizationId: orgB.id }),
      }),
    )
    expect(res.status).toBe(201)
    expect((await res.json()).opportunity.organizationId).toBe(orgA.id)
  })
})

describe('CRM move and history', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupCrmFixtures()
  })

  it('moves opportunity and records history', async () => {
    const { org } = await createOrganizationWithRbac('Org Move', `org-crm-move-${Date.now()}`)
    const { pipelineId, stages } = await ensurePipeline(org.id)
    const lead = await createLeadDirect(org.id, { name: 'Move Lead' })
    const opp = await createOpportunityDirect(org.id, {
      leadId: lead.id,
      pipelineId,
      stageId: stages[0]!.id,
      title: 'Move Opp',
    })

    const token = await adminToken(org.id, 'admin-move')
    const headers = { ...cookieHeader(token), 'Content-Type': 'application/json' }
    const ctx = { params: Promise.resolve({ id: opp.id }) }

    const res = await moveOpportunityPost(
      new Request(`http://localhost/api/crm/opportunities/${opp.id}/move`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ stageId: stages[1]!.id }),
      }),
      ctx,
    )
    expect(res.status).toBe(200)
    expect((await res.json()).opportunity.stageId).toBe(stages[1]!.id)

    const history = await prisma.opportunityStageHistory.findMany({
      where: { opportunityId: opp.id },
      orderBy: { createdAt: 'asc' },
    })
    expect(history.length).toBeGreaterThanOrEqual(1)
    const last = history[history.length - 1]
    expect(last?.fromStageId).toBe(stages[0]!.id)
    expect(last?.toStageId).toBe(stages[1]!.id)
  })

  it('rejects stage from another pipeline', async () => {
    const { org } = await createOrganizationWithRbac('Org Cross Pipe', `org-crm-xpipe-${Date.now()}`)
    const pipeA = await ensurePipeline(org.id)
    const pipeB = await prisma.pipeline.create({
      data: {
        organizationId: org.id,
        name: 'Other Pipeline',
        stages: {
          create: [{ organizationId: org.id, name: 'Stage B', position: 0 }],
        },
      },
      include: { stages: true },
    })
    const lead = await createLeadDirect(org.id, { name: 'Cross Pipe Lead' })
    const opp = await createOpportunityDirect(org.id, {
      leadId: lead.id,
      pipelineId: pipeA.pipelineId,
      stageId: pipeA.stages[0]!.id,
      title: 'Cross',
    })

    const token = await adminToken(org.id, 'admin-xpipe')
    const res = await moveOpportunityPost(
      new Request(`http://localhost/api/crm/opportunities/${opp.id}/move`, {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ stageId: pipeB.stages[0]!.id }),
      }),
      { params: Promise.resolve({ id: opp.id }) },
    )
    expect(res.status).toBe(400)
  })
})

describe('CRM pipelines and stages', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupCrmFixtures()
  })

  it('creates pipeline and stages', async () => {
    const { org } = await createOrganizationWithRbac('Org Pipe', `org-crm-pipe-${Date.now()}`)
    const token = await adminToken(org.id, 'admin-pipe')
    const headers = { ...cookieHeader(token), 'Content-Type': 'application/json' }

    const createRes = await createPipelinePost(
      new Request('http://localhost/api/crm/pipelines', {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: 'Custom Pipeline', description: 'Test' }),
      }),
    )
    expect(createRes.status).toBe(201)
    const pipeline = (await createRes.json()).pipeline

    const stageRes = await createStagePost(
      new Request(`http://localhost/api/crm/pipelines/${pipeline.id}/stages`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name: 'Custom Stage', position: 0 }),
      }),
      { params: Promise.resolve({ id: pipeline.id }) },
    )
    expect(stageRes.status).toBe(201)

    const listRes = await listPipelinesGet(
      new Request('http://localhost/api/crm/pipelines', { headers: cookieHeader(token) }),
    )
    expect(listRes.status).toBe(200)
    expect((await listRes.json()).pipelines.length).toBeGreaterThanOrEqual(1)

    const patchRes = await updatePipelinePatch(
      new Request(`http://localhost/api/crm/pipelines/${pipeline.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ name: 'Renamed Pipeline' }),
      }),
      { params: Promise.resolve({ id: pipeline.id }) },
    )
    expect(patchRes.status).toBe(200)
    expect((await patchRes.json()).pipeline.name).toBe('Renamed Pipeline')
  })

  it('updates stage', async () => {
    const { org } = await createOrganizationWithRbac('Org Stage', `org-crm-stage-${Date.now()}`)
    const { pipelineId, stages } = await ensurePipeline(org.id)
    const token = await adminToken(org.id, 'admin-stage')
    const headers = { ...cookieHeader(token), 'Content-Type': 'application/json' }

    const res = await updateStagePatch(
      new Request(`http://localhost/api/crm/pipelines/${pipelineId}/stages/${stages[0]!.id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ name: 'Renamed Stage' }),
      }),
      { params: Promise.resolve({ id: pipelineId, stageId: stages[0]!.id }) },
    )
    expect(res.status).toBe(200)
    expect((await res.json()).stage.name).toBe('Renamed Stage')
  })
})

describe('CRM interactions', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupCrmFixtures()
  })

  it('creates and lists CRM interactions', async () => {
    const { org } = await createOrganizationWithRbac('Org Int', `org-crm-int-${Date.now()}`)
    const { pipelineId, stages } = await ensurePipeline(org.id)
    const lead = await createLeadDirect(org.id, { name: 'Int Lead' })
    const opp = await createOpportunityDirect(org.id, {
      leadId: lead.id,
      pipelineId,
      stageId: stages[0]!.id,
      title: 'Int Opp',
    })

    const { user } = await createUserWithMembership(
      org.id,
      `admin-int-${Date.now()}@test.local`,
      'Admin',
      ROLE_SLUGS.ADMIN,
    )
    const token = await loginSession(user.id, org.id)
    const headers = { ...cookieHeader(token), 'Content-Type': 'application/json' }
    const ctx = { params: Promise.resolve({ id: opp.id }) }

    const createRes = await createCrmInteractionPost(
      new Request(`http://localhost/api/crm/opportunities/${opp.id}/interactions`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ type: 'MEETING', description: 'Discovery call' }),
      }),
      ctx,
    )
    expect(createRes.status).toBe(201)
    expect((await createRes.json()).interaction.type).toBe('MEETING')

    const listRes = await listCrmInteractionsGet(
      new Request(`http://localhost/api/crm/opportunities/${opp.id}/interactions`, {
        headers: cookieHeader(token),
      }),
      ctx,
    )
    expect(listRes.status).toBe(200)
    expect((await listRes.json()).interactions).toHaveLength(1)
  })
})

describe('CRM tenant isolation', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupCrmFixtures()
  })

  it('denies cross-tenant access', async () => {
    const { org: orgA } = await createOrganizationWithRbac('Org A CRM', `org-a-crm-${Date.now()}`)
    const { org: orgB } = await createOrganizationWithRbac('Org B CRM', `org-b-crm-${Date.now()}`)
    const { pipelineId, stages } = await ensurePipeline(orgB.id)
    const leadB = await createLeadDirect(orgB.id, { name: 'Lead B' })
    const oppB = await createOpportunityDirect(orgB.id, {
      leadId: leadB.id,
      pipelineId,
      stageId: stages[0]!.id,
      title: 'Secret Opp',
    })

    const token = await adminToken(orgA.id, 'admin-iso')
    const headers = cookieHeader(token)
    const ctx = { params: Promise.resolve({ id: oppB.id }) }

    expect(
      (await getOpportunityGet(new Request(`http://localhost/api/crm/opportunities/${oppB.id}`, { headers }), ctx)).status,
    ).toBe(404)

    expect(
      (
        await updateOpportunityPatch(
          new Request(`http://localhost/api/crm/opportunities/${oppB.id}`, {
            method: 'PATCH',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: 'Hacked' }),
          }),
          ctx,
        )
      ).status,
    ).toBe(404)

    expect(
      (
        await moveOpportunityPost(
          new Request(`http://localhost/api/crm/opportunities/${oppB.id}/move`, {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ stageId: stages[1]!.id }),
          }),
          ctx,
        )
      ).status,
    ).toBe(404)
  })

  it('rejects cross-tenant lead on create', async () => {
    const { org: orgA } = await createOrganizationWithRbac('Org A Lead', `org-a-lead-crm-${Date.now()}`)
    const { org: orgB } = await createOrganizationWithRbac('Org B Lead', `org-b-lead-crm-${Date.now()}`)
    const leadB = await createLeadDirect(orgB.id, { name: 'Lead B' })
    const token = await adminToken(orgA.id, 'admin-lead-x')

    const res = await createOpportunityPost(
      new Request('http://localhost/api/crm/opportunities', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: leadB.id, title: 'Bad Opp' }),
      }),
    )
    expect(res.status).toBe(400)
  })

  it('rejects cross-tenant partner on create', async () => {
    const { org: orgA } = await createOrganizationWithRbac('Org A Part', `org-a-part-crm-${Date.now()}`)
    const { org: orgB } = await createOrganizationWithRbac('Org B Part', `org-b-part-crm-${Date.now()}`)
    const leadA = await createLeadDirect(orgA.id, { name: 'Lead A' })
    const partnerB = await createPartnerDirect(orgB.id, { name: 'Partner B' })
    const { pipelineId, stages } = await ensurePipeline(orgA.id)
    const token = await adminToken(orgA.id, 'admin-part-x')

    const res = await createOpportunityPost(
      new Request('http://localhost/api/crm/opportunities', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: leadA.id,
          pipelineId,
          stageId: stages[0]!.id,
          title: 'Bad Partner',
          partnerId: partnerB.id,
        }),
      }),
    )
    expect(res.status).toBe(400)
  })
})

describe('CRM partner scope', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupCrmFixtures()
  })

  it('partner sees only own opportunities', async () => {
    const { org } = await createOrganizationWithRbac('Org Partner', `org-crm-partner-${Date.now()}`)
    const { pipelineId, stages } = await ensurePipeline(org.id)

    const { user: partnerUserX } = await createUserWithMembership(
      org.id,
      `partner-x-${Date.now()}@test.local`,
      'Partner X',
      ROLE_SLUGS.PARCEIRO,
    )
    const partnerX = await createPartnerDirect(org.id, {
      name: 'Partner X',
      status: 'ACTIVE',
      userId: partnerUserX.id,
    })
    const partnerY = await createPartnerDirect(org.id, { name: 'Partner Y', status: 'ACTIVE' })

    const leadX = await createLeadDirect(org.id, { name: 'Lead X', partnerId: partnerX.id })
    const leadY = await createLeadDirect(org.id, { name: 'Lead Y', partnerId: partnerY.id })

    await createOpportunityDirect(org.id, {
      leadId: leadX.id,
      pipelineId,
      stageId: stages[0]!.id,
      title: 'Opp X',
      partnerId: partnerX.id,
    })
    await createOpportunityDirect(org.id, {
      leadId: leadY.id,
      pipelineId,
      stageId: stages[0]!.id,
      title: 'Opp Y',
      partnerId: partnerY.id,
    })

    const tokenX = await loginSession(partnerUserX.id, org.id)
    const headers = cookieHeader(tokenX)

    const listRes = await listOpportunitiesGet(
      new Request('http://localhost/api/crm/opportunities', { headers }),
    )
    expect(listRes.status).toBe(200)
    const body = await listRes.json()
    expect(body.opportunities).toHaveLength(1)
    expect(body.opportunities[0].title).toBe('Opp X')

    const spoofRes = await listOpportunitiesGet(
      new Request(`http://localhost/api/crm/opportunities?partnerId=${partnerY.id}`, { headers }),
    )
    expect((await spoofRes.json()).opportunities).toHaveLength(0)
  })

  it('partner cannot access other partner opportunity by id', async () => {
    const { org } = await createOrganizationWithRbac('Org Partner ID', `org-crm-partner-id-${Date.now()}`)
    const { pipelineId, stages } = await ensurePipeline(org.id)

    const { user: partnerUserX } = await createUserWithMembership(
      org.id,
      `partner-id-x-${Date.now()}@test.local`,
      'Partner X',
      ROLE_SLUGS.PARCEIRO,
    )
    await createPartnerDirect(org.id, {
      name: 'Partner X',
      status: 'ACTIVE',
      userId: partnerUserX.id,
    })
    const partnerY = await createPartnerDirect(org.id, { name: 'Partner Y', status: 'ACTIVE' })
    const leadY = await createLeadDirect(org.id, { name: 'Lead Y', partnerId: partnerY.id })
    const oppY = await createOpportunityDirect(org.id, {
      leadId: leadY.id,
      pipelineId,
      stageId: stages[0]!.id,
      title: 'Secret Y',
      partnerId: partnerY.id,
    })

    const tokenX = await loginSession(partnerUserX.id, org.id)
    const res = await getOpportunityGet(
      new Request(`http://localhost/api/crm/opportunities/${oppY.id}`, {
        headers: cookieHeader(tokenX),
      }),
      { params: Promise.resolve({ id: oppY.id }) },
    )
    expect(res.status).toBe(404)
  })
})

describe('CRM RBAC', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupCrmFixtures()
  })

  it('returns 401 without session', async () => {
    const res = await listOpportunitiesGet(new Request('http://localhost/api/crm/opportunities'))
    expect(res.status).toBe(401)
  })

  it('returns 403 without CRM permissions', async () => {
    const { org } = await createOrganizationWithRbac('Org No Perm', `org-crm-noperm-${Date.now()}`)
    const { user } = await createUserWithMembership(
      org.id,
      `noperm-${Date.now()}@test.local`,
      'No Role',
    )
    const token = await loginSession(user.id, org.id)
    const headers = cookieHeader(token)

    expect((await listOpportunitiesGet(new Request('http://localhost/api/crm/opportunities', { headers }))).status).toBe(403)
    expect(
      (
        await createOpportunityPost(
          new Request('http://localhost/api/crm/opportunities', {
            method: 'POST',
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ leadId: '00000000-0000-4000-8000-000000000099', title: 'X' }),
          }),
        )
      ).status,
    ).toBe(403)
    expect((await listPipelinesGet(new Request('http://localhost/api/crm/pipelines', { headers }))).status).toBe(403)
  })
})

describe('CRM history immutability', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupCrmFixtures()
  })

  it('appends history on move and preserves prior records', async () => {
    const { org } = await createOrganizationWithRbac('Org Hist', `org-crm-hist-${Date.now()}`)
    const { pipelineId, stages } = await ensurePipeline(org.id)
    const lead = await createLeadDirect(org.id, { name: 'Hist Lead' })
    const opp = await createOpportunityDirect(org.id, {
      leadId: lead.id,
      pipelineId,
      stageId: stages[0]!.id,
      title: 'Hist Opp',
    })

    const token = await adminToken(org.id, 'admin-hist')
    const headers = { ...cookieHeader(token), 'Content-Type': 'application/json' }
    const ctx = { params: Promise.resolve({ id: opp.id }) }

    const before = await prisma.opportunityStageHistory.count({ where: { opportunityId: opp.id } })

    await moveOpportunityPost(
      new Request(`http://localhost/api/crm/opportunities/${opp.id}/move`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ stageId: stages[1]!.id }),
      }),
      ctx,
    )

    await moveOpportunityPost(
      new Request(`http://localhost/api/crm/opportunities/${opp.id}/move`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ stageId: stages[2]!.id }),
      }),
      ctx,
    )

    const after = await prisma.opportunityStageHistory.findMany({
      where: { opportunityId: opp.id },
      orderBy: { createdAt: 'asc' },
    })
    expect(after.length).toBe(before + 2)
    expect(after[after.length - 1]?.toStageId).toBe(stages[2]!.id)
  })

  it('does not create history when moving to same stage', async () => {
    const { org } = await createOrganizationWithRbac('Org Same', `org-crm-same-${Date.now()}`)
    const { pipelineId, stages } = await ensurePipeline(org.id)
    const lead = await createLeadDirect(org.id, { name: 'Same Lead' })
    const opp = await createOpportunityDirect(org.id, {
      leadId: lead.id,
      pipelineId,
      stageId: stages[0]!.id,
      title: 'Same Opp',
    })

    const countBefore = await prisma.opportunityStageHistory.count({ where: { opportunityId: opp.id } })
    const token = await adminToken(org.id, 'admin-same')

    await moveOpportunityPost(
      new Request(`http://localhost/api/crm/opportunities/${opp.id}/move`, {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ stageId: stages[0]!.id }),
      }),
      { params: Promise.resolve({ id: opp.id }) },
    )

    const countAfter = await prisma.opportunityStageHistory.count({ where: { opportunityId: opp.id } })
    expect(countAfter).toBe(countBefore)
  })
})

describe('CRM inactive pipeline', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupCrmFixtures()
  })

  it('rejects new opportunity on inactive pipeline', async () => {
    const { org } = await createOrganizationWithRbac('Org Inactive', `org-crm-inactive-${Date.now()}`)
    const { pipelineId, stages } = await ensurePipeline(org.id)
    await prisma.pipeline.update({ where: { id: pipelineId }, data: { isActive: false } })
    const lead = await createLeadDirect(org.id, { name: 'Inactive Lead' })
    const token = await adminToken(org.id, 'admin-inactive')

    const res = await createOpportunityPost(
      new Request('http://localhost/api/crm/opportunities', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: lead.id,
          pipelineId,
          stageId: stages[0]!.id,
          title: 'Should Fail',
        }),
      }),
    )
    expect(res.status).toBe(400)
  })
})

describe('CRM pipeline tenant isolation', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    clearAuthorizationCacheForTests()
    await cleanupCrmFixtures()
  })

  it('denies cross-tenant pipeline access', async () => {
    const { org: orgA } = await createOrganizationWithRbac('Org Pipe A', `org-pipe-a-${Date.now()}`)
    const { org: orgB } = await createOrganizationWithRbac('Org Pipe B', `org-pipe-b-${Date.now()}`)
    const { pipelineId } = await ensurePipeline(orgB.id)

    const token = await adminToken(orgA.id, 'admin-pipe-iso')
    const res = await updatePipelinePatch(
      new Request(`http://localhost/api/crm/pipelines/${pipelineId}`, {
        method: 'PATCH',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Hacked' }),
      }),
      { params: Promise.resolve({ id: pipelineId }) },
    )
    expect(res.status).toBe(404)
  })
})
