import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, before, describe, it, mock } from 'node:test'
import { buildApp } from '../src/app.js'
import { loadConfig } from '../src/config.js'
import { openDatabase } from '../src/db/index.js'
import { asaasProvider } from '../src/providers/asaas.js'

describe('pix-gateway', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pix-gateway-'))
  const dbPath = join(dir, 'test.db')
  const apiKey = 'test-gateway-api-key-12345'
  let app: Awaited<ReturnType<typeof buildApp>>

  before(async () => {
    const config = loadConfig({
      PIX_GATEWAY_API_KEY: apiKey,
      PORT: '8799',
      DATABASE_PATH: dbPath,
      NODE_ENV: 'test',
      PUBLIC_BASE_URL: 'http://localhost:8799',
    })
    const db = openDatabase(dbPath)
    app = await buildApp(config, db)
    await app.ready()
  })

  after(async () => {
    await app.close()
    rmSync(dir, { recursive: true, force: true })
    mock.restoreAll()
  })

  it('parseWebhook marca pagamento confirmado', () => {
    const event = asaasProvider.parseWebhook({
      event: 'PAYMENT_CONFIRMED',
      payment: {
        id: 'pay_123',
        status: 'CONFIRMED',
        confirmedDate: '2026-08-06',
      },
    })
    assert.equal(event?.status, 'paid')
    assert.equal(event?.providerChargeId, 'pay_123')
  })

  it('cria conta, cobrança (Asaas mock) e confirma via webhook automaticamente', async () => {
    mock.method(globalThis, 'fetch', async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input)
      if (url.endsWith('/v3/customers') && init?.method === 'POST') {
        return new Response(JSON.stringify({ id: 'cus_1' }), { status: 200 })
      }
      if (url.endsWith('/v3/payments') && init?.method === 'POST') {
        return new Response(JSON.stringify({ id: 'pay_abc', status: 'PENDING' }), { status: 200 })
      }
      if (url.includes('/pixQrCode')) {
        return new Response(
          JSON.stringify({
            payload: '00020126580014br.gov.bcb.pix0136fake',
            encodedImage: 'base64img',
            expirationDate: '2026-08-06 23:00:00',
          }),
          { status: 200 },
        )
      }
      return new Response('not mocked: ' + url, { status: 500 })
    })

    const accountRes = await app.inject({
      method: 'POST',
      url: '/v1/accounts',
      headers: { 'x-api-key': apiKey },
      payload: {
        name: 'Conta Pessoal',
        apiKey: 'asaas_$test',
        apiUrl: 'https://api-sandbox.asaas.com',
        webhookToken: 'whsec_test_token',
      },
    })
    assert.equal(accountRes.statusCode, 201)
    const accountBody = accountRes.json() as {
      account: { id: string }
      webhookUrl: string
    }
    assert.match(accountBody.webhookUrl, /\/v1\/webhooks\/asaas\//)

    const keyRes = await app.inject({
      method: 'POST',
      url: `/v1/accounts/${accountBody.account.id}/keys`,
      headers: { 'x-api-key': apiKey },
      payload: {
        label: 'EVP principal',
        keyType: 'evp',
        keyValue: '123e4567-e89b-12d3-a456-426614174000',
      },
    })
    assert.equal(keyRes.statusCode, 201)

    const chargeRes = await app.inject({
      method: 'POST',
      url: '/v1/charges',
      headers: {
        'x-api-key': apiKey,
        'idempotency-key': 'idem-1',
      },
      payload: {
        amountCents: 2500,
        description: 'Teste',
        accountId: accountBody.account.id,
        customerName: 'Cliente',
        customerCpfCnpj: '24971563792',
      },
    })
    assert.equal(chargeRes.statusCode, 201, chargeRes.body)
    const charge = (chargeRes.json() as { charge: { id: string; status: string; copyPaste: string } })
      .charge
    assert.equal(charge.status, 'pending')
    assert.ok(charge.copyPaste.includes('br.gov.bcb.pix'))

    // Confirmação automática via webhook Asaas (sem ação manual)
    const wh = await app.inject({
      method: 'POST',
      url: `/v1/webhooks/asaas/${accountBody.account.id}?access_token=whsec_test_token`,
      payload: {
        event: 'PAYMENT_RECEIVED',
        payment: {
          id: 'pay_abc',
          status: 'RECEIVED',
          confirmedDate: '2026-08-06',
        },
      },
    })
    assert.equal(wh.statusCode, 200, wh.body)
    const whBody = wh.json() as { processed: boolean; status: string }
    assert.equal(whBody.processed, true)
    assert.equal(whBody.status, 'paid')

    const getRes = await app.inject({
      method: 'GET',
      url: `/v1/charges/${charge.id}`,
      headers: { 'x-api-key': apiKey },
    })
    assert.equal(getRes.statusCode, 200)
    assert.equal((getRes.json() as { charge: { status: string } }).charge.status, 'paid')
  })

  it('roteia round_robin entre contas', async () => {
    const a1 = await app.inject({
      method: 'POST',
      url: '/v1/accounts',
      headers: { 'x-api-key': apiKey },
      payload: { name: 'A', apiKey: 'asaas_a_key_xx', webhookToken: 'token_conta_a' },
    })
    const a2 = await app.inject({
      method: 'POST',
      url: '/v1/accounts',
      headers: { 'x-api-key': apiKey },
      payload: { name: 'B', apiKey: 'asaas_b_key_xx', webhookToken: 'token_conta_b' },
    })
    assert.equal(a1.statusCode, 201, a1.body)
    assert.equal(a2.statusCode, 201, a2.body)

    let payCounter = 0
    mock.method(globalThis, 'fetch', async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input)
      if (url.endsWith('/v3/customers') && init?.method === 'POST') {
        return new Response(JSON.stringify({ id: 'cus_x' }), { status: 200 })
      }
      if (url.endsWith('/v3/payments') && init?.method === 'POST') {
        payCounter += 1
        return new Response(JSON.stringify({ id: `pay_rr_${payCounter}`, status: 'PENDING' }), {
          status: 200,
        })
      }
      if (url.includes('/pixQrCode')) {
        return new Response(JSON.stringify({ payload: '00020126pix', encodedImage: null }), {
          status: 200,
        })
      }
      return new Response('fail', { status: 500 })
    })

    const c1 = await app.inject({
      method: 'POST',
      url: '/v1/charges',
      headers: { 'x-api-key': apiKey },
      payload: {
        amountCents: 100,
        routing: 'round_robin',
        customerCpfCnpj: '24971563792',
      },
    })
    const c2 = await app.inject({
      method: 'POST',
      url: '/v1/charges',
      headers: { 'x-api-key': apiKey },
      payload: {
        amountCents: 100,
        routing: 'round_robin',
        customerCpfCnpj: '24971563792',
      },
    })

    assert.equal(c1.statusCode, 201, c1.body)
    assert.equal(c2.statusCode, 201, c2.body)
    const acc1 = (c1.json() as { charge: { accountId: string } }).charge.accountId
    const acc2 = (c2.json() as { charge: { accountId: string } }).charge.accountId
    // Com várias contas ativas, round_robin não deve repetir em sequência
    assert.notEqual(acc1, acc2)
  })
})
