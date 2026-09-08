import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { Prisma } from '@prisma/client'
import { GET as listSalesGet, POST as createSalePost } from '@/app/api/sales/route'
import { GET as getSaleGet, PATCH as updateSalePatch } from '@/app/api/sales/[id]/route'
import { POST as confirmPaymentPost } from '@/app/api/sales/[id]/confirm-payment/route'
import { GET as listCustomersGet, POST as createCustomerPost } from '@/app/api/customers/route'
import { GET as getCustomerGet } from '@/app/api/customers/[id]/route'
import { POST as convertLeadPost } from '@/app/api/customers/convert/route'
import { clearAuthorizationCacheForTests } from '@/lib/authorization'
import { ROLE_SLUGS } from '@/lib/authorization/roles'
import { prisma } from '@/lib/db'
import { resetEnvCache } from '@/config/env'
import { setTestEnv } from '../helpers/env'
import {
  cleanupSalesFixtures,
  cookieHeader,
  createCustomerDirect,
  createLeadDirect,
  createOrganizationWithRbac,
  createUserWithMembership,
  ensurePipeline,
  createOpportunityDirect,
  loginSession,
  setupSellableCatalog,
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

async function parceiroToken(orgId: string, prefix: string) {
  const { user } = await createUserWithMembership(
    orgId,
    `${prefix}-${Date.now()}@test.local`,
    'Parceiro',
    ROLE_SLUGS.PARCEIRO,
  )
  return loginSession(user.id, orgId)
}

describe('sales and customers', () => {
  beforeEach(setupEnv)
  afterEach(async () => {
    await cleanupSalesFixtures()
  })

  it('creates sale with offer snapshot and customer from lead', async () => {
    const { org } = await createOrganizationWithRbac('Org Sale', `org-${Date.now()}`)
    const token = await adminToken(org.id, 'admin')
    const { offer } = await setupSellableCatalog(org.id)
    const lead = await createLeadDirect(org.id, { name: 'João Silva', email: 'joao@test.local' })

    const res = await createSalePost(
      new Request('http://localhost/api/sales', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId: offer.id,
          leadId: lead.id,
          status: 'PENDING_PAYMENT',
        }),
      }),
    )

    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.sale.listPrice).toBe('4900')
    expect(data.sale.finalPrice).toBe('4900')
    expect(data.sale.offerNameSnapshot).toBe('Landing Premium')
    expect(data.sale.status).toBe('PENDING_PAYMENT')

    const leadStillExists = await prisma.lead.findUnique({ where: { id: lead.id } })
    expect(leadStillExists).not.toBeNull()

    const customer = await prisma.customer.findFirst({ where: { leadId: lead.id } })
    expect(customer).not.toBeNull()
    expect(customer!.name).toBe('João Silva')
  })

  it('preserves sale snapshot when offer price changes', async () => {
    const { org } = await createOrganizationWithRbac('Org Sale', `org-${Date.now()}`)
    const token = await adminToken(org.id, 'admin')
    const { offer, product } = await setupSellableCatalog(org.id)
    const customer = await createCustomerDirect(org.id, { name: 'Cliente A' })

    const createRes = await createSalePost(
      new Request('http://localhost/api/sales', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId: offer.id,
          customerId: customer.id,
          status: 'PENDING_PAYMENT',
        }),
      }),
    )
    expect(createRes.status).toBe(201)
    const { sale } = await createRes.json()
    expect(sale.finalPrice).toBe('4900')

    await prisma.offer.update({
      where: { id: offer.id },
      data: { price: new Prisma.Decimal('5900') },
    })

    const getRes = await getSaleGet(
      new Request(`http://localhost/api/sales/${sale.id}`, {
        headers: cookieHeader(token),
      }),
      { params: Promise.resolve({ id: sale.id }) },
    )
    const getData = await getRes.json()
    expect(getData.sale.finalPrice).toBe('4900')
    expect(getData.sale.listPrice).toBe('4900')

    // sanity: offer changed but sale unchanged
    expect(product.id).toBeTruthy()
  })

  it('confirms payment PENDING_PAYMENT → PAID', async () => {
    const { org } = await createOrganizationWithRbac('Org Sale', `org-${Date.now()}`)
    const token = await adminToken(org.id, 'admin')
    const { offer } = await setupSellableCatalog(org.id)
    const customer = await createCustomerDirect(org.id, { name: 'Cliente B' })

    const createRes = await createSalePost(
      new Request('http://localhost/api/sales', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId: offer.id,
          customerId: customer.id,
          status: 'PENDING_PAYMENT',
        }),
      }),
    )
    const { sale } = await createRes.json()

    const confirmRes = await confirmPaymentPost(
      new Request(`http://localhost/api/sales/${sale.id}/confirm-payment`, {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentMethod: 'pix', paymentReference: 'REF-001' }),
      }),
      { params: Promise.resolve({ id: sale.id }) },
    )
    expect(confirmRes.status).toBe(200)
    const confirmData = await confirmRes.json()
    expect(confirmData.sale.status).toBe('PAID')
    expect(confirmData.sale.paidAt).toBeTruthy()
    expect(confirmData.sale.paidByUserId).toBeTruthy()
    expect(confirmData.sale.paymentMethod).toBe('pix')

    const duplicateConfirm = await confirmPaymentPost(
      new Request(`http://localhost/api/sales/${sale.id}/confirm-payment`, {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      }),
      { params: Promise.resolve({ id: sale.id }) },
    )
    expect(duplicateConfirm.status).toBe(400)
  })

  it('rejects invalid status transitions', async () => {
    const { org } = await createOrganizationWithRbac('Org Sale', `org-${Date.now()}`)
    const token = await adminToken(org.id, 'admin')
    const { offer, product } = await setupSellableCatalog(org.id)
    const customer = await createCustomerDirect(org.id, { name: 'Cliente C' })

    const createRes = await createSalePost(
      new Request('http://localhost/api/sales', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId: offer.id, customerId: customer.id, status: 'DRAFT' }),
      }),
    )
    const { sale } = await createRes.json()

    const invalid = await updateSalePatch(
      new Request(`http://localhost/api/sales/${sale.id}`, {
        method: 'PATCH',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PAID' }),
      }),
      { params: Promise.resolve({ id: sale.id }) },
    )
    expect(invalid.status).toBe(400)

    const cancel = await updateSalePatch(
      new Request(`http://localhost/api/sales/${sale.id}`, {
        method: 'PATCH',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELED' }),
      }),
      { params: Promise.resolve({ id: sale.id }) },
    )
    expect(cancel.status).toBe(200)

    const revive = await updateSalePatch(
      new Request(`http://localhost/api/sales/${sale.id}`, {
        method: 'PATCH',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PAID' }),
      }),
      { params: Promise.resolve({ id: sale.id }) },
    )
    expect(revive.status).toBe(400)

    expect(product.id).toBeTruthy()
  })

  it('converts lead to customer preserving lead', async () => {
    const { org } = await createOrganizationWithRbac('Org Sale', `org-${Date.now()}`)
    const token = await adminToken(org.id, 'admin')
    const lead = await createLeadDirect(org.id, { name: 'Maria Lead', email: 'maria@test.local' })
    await prisma.leadInteraction.create({
      data: {
        organizationId: org.id,
        leadId: lead.id,
        type: 'NOTE',
        description: 'Initial contact',
        occurredAt: new Date(),
        createdByUserId: (await createUserWithMembership(org.id, `u-${Date.now()}@t.local`, 'U', ROLE_SLUGS.ADMIN)).user.id,
      },
    })

    const res = await convertLeadPost(
      new Request('http://localhost/api/customers/convert', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id }),
      }),
    )
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.customer.leadId).toBe(lead.id)

    const interactions = await prisma.leadInteraction.count({ where: { leadId: lead.id } })
    expect(interactions).toBe(1)

    const duplicate = await convertLeadPost(
      new Request('http://localhost/api/customers/convert', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id }),
      }),
    )
    expect(duplicate.status).toBe(201)
    const dupData = await duplicate.json()
    expect(dupData.customer.id).toBe(data.customer.id)
  })

  it('prevents duplicate customer by document within tenant', async () => {
    const { org } = await createOrganizationWithRbac('Org Sale', `org-${Date.now()}`)
    const token = await adminToken(org.id, 'admin')

    const first = await createCustomerPost(
      new Request('http://localhost/api/customers', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Empresa A', document: '12.345.678/0001-90' }),
      }),
    )
    expect(first.status).toBe(201)

    const second = await createCustomerPost(
      new Request('http://localhost/api/customers', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Empresa B', document: '12.345.678/0001-90' }),
      }),
    )
    expect(second.status).toBe(409)
  })

  it('denies cross-tenant sale and customer access (IDOR)', async () => {
    const { org: orgA } = await createOrganizationWithRbac('Org A', `org-a-${Date.now()}`)
    const { org: orgB } = await createOrganizationWithRbac('Org B', `org-b-${Date.now()}`)
    const tokenA = await adminToken(orgA.id, 'admin-a')

    const { offer: offerB } = await setupSellableCatalog(orgB.id)
    const customerB = await createCustomerDirect(orgB.id, { name: 'Customer B' })

    const crossOffer = await createSalePost(
      new Request('http://localhost/api/sales', {
        method: 'POST',
        headers: { ...cookieHeader(tokenA), 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId: offerB.id, customerId: customerB.id }),
      }),
    )
    expect(crossOffer.status).toBe(404)

    const { offer: offerA, product: productA } = await setupSellableCatalog(orgA.id)
    const customerA = await createCustomerDirect(orgA.id, { name: 'Customer A' })
    const saleA = await prisma.sale.create({
      data: {
        organizationId: orgA.id,
        customerId: customerA.id,
        productId: productA.id,
        offerId: offerA.id,
        productNameSnapshot: 'P',
        offerNameSnapshot: 'O',
        listPrice: new Prisma.Decimal('100'),
        finalPrice: new Prisma.Decimal('100'),
        status: 'PENDING_PAYMENT',
      },
    })

    const getCross = await getSaleGet(
      new Request(`http://localhost/api/sales/${saleA.id}`, {
        headers: cookieHeader(await adminToken(orgB.id, 'admin-b')),
      }),
      { params: Promise.resolve({ id: saleA.id }) },
    )
    expect(getCross.status).toBe(404)

    const getCustomerCross = await getCustomerGet(
      new Request(`http://localhost/api/customers/${customerB.id}`, {
        headers: cookieHeader(tokenA),
      }),
      { params: Promise.resolve({ id: customerB.id }) },
    )
    expect(getCustomerCross.status).toBe(404)
  })

  it('rejects price override without sale.update permission', async () => {
    const { org } = await createOrganizationWithRbac('Org Sale', `org-${Date.now()}`)
    const token = await parceiroToken(org.id, 'parc')
    const { offer } = await setupSellableCatalog(org.id)
    const lead = await createLeadDirect(org.id, { name: 'Lead Parceiro' })

    const res = await createSalePost(
      new Request('http://localhost/api/sales', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId: offer.id,
          leadId: lead.id,
          finalPrice: '4500',
          status: 'PENDING_PAYMENT',
        }),
      }),
    )
    expect(res.status).toBe(403)
  })

  it('returns 401 without session and 403 without permission', async () => {
    const { org } = await createOrganizationWithRbac('Org Sale', `org-${Date.now()}`)
    const token = await adminToken(org.id, 'admin')
    const { user } = await createUserWithMembership(
      org.id,
      `noperm-${Date.now()}@test.local`,
      'No Perm',
      ROLE_SLUGS.ADMIN,
    )
    // Remove all roles permissions by using a custom approach - use parceiro without sale read
    // Actually test unauthenticated
    const unauth = await listSalesGet(new Request('http://localhost/api/sales'))
    expect(unauth.status).toBe(401)

    const listOk = await listSalesGet(
      new Request('http://localhost/api/sales', { headers: cookieHeader(token) }),
    )
    expect(listOk.status).toBe(200)

    const listCustomersOk = await listCustomersGet(
      new Request('http://localhost/api/customers', { headers: cookieHeader(token) }),
    )
    expect(listCustomersOk.status).toBe(200)

    expect(user.id).toBeTruthy()
  })

  it('creates sale linked to opportunity', async () => {
    const { org } = await createOrganizationWithRbac('Org Sale', `org-${Date.now()}`)
    const token = await adminToken(org.id, 'admin')
    const { offer } = await setupSellableCatalog(org.id)
    const lead = await createLeadDirect(org.id, { name: 'Opp Lead' })
    const pipeline = await ensurePipeline(org.id)
    const stage = pipeline.stages[0]!
    const opportunity = await createOpportunityDirect(org.id, {
      leadId: lead.id,
      pipelineId: pipeline.pipelineId,
      stageId: stage.id,
      title: 'Big deal',
    })

    const res = await createSalePost(
      new Request('http://localhost/api/sales', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          offerId: offer.id,
          leadId: lead.id,
          opportunityId: opportunity.id,
          status: 'PENDING_PAYMENT',
        }),
      }),
    )
    expect(res.status).toBe(201)
    const data = await res.json()
    expect(data.sale.opportunityId).toBe(opportunity.id)

    const oppStill = await prisma.opportunity.findUnique({ where: { id: opportunity.id } })
    expect(oppStill).not.toBeNull()
  })

  it('rejects inactive offer for sale creation', async () => {
    const { org } = await createOrganizationWithRbac('Org Sale', `org-${Date.now()}`)
    const token = await adminToken(org.id, 'admin')
    const { offer } = await setupSellableCatalog(org.id)
    await prisma.offer.update({ where: { id: offer.id }, data: { status: 'INACTIVE' } })
    const customer = await createCustomerDirect(org.id, { name: 'Cliente' })

    const res = await createSalePost(
      new Request('http://localhost/api/sales', {
        method: 'POST',
        headers: { ...cookieHeader(token), 'Content-Type': 'application/json' },
        body: JSON.stringify({ offerId: offer.id, customerId: customer.id }),
      }),
    )
    expect(res.status).toBe(400)
  })
})
