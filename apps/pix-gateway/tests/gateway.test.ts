import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, before, describe, it } from 'node:test'
import { buildApp } from '../src/app.js'
import { loadConfig } from '../src/config.js'
import { JsonDatabase } from '../src/db/json-store.js'

describe('pix-gateway native (grátis)', () => {
  const dir = mkdtempSync(join(tmpdir(), 'pix-gateway-'))
  const dbPath = join(dir, 'test.json')
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
    const db = await JsonDatabase.open(dbPath)
    app = await buildApp(config, db)
    await app.ready()
  })

  after(async () => {
    await app.close()
    rmSync(dir, { recursive: true, force: true })
  })

  it('cria conta native, chave, cobrança grátis e confirma via webhook automaticamente', async () => {
    const accountRes = await app.inject({
      method: 'POST',
      url: '/v1/accounts',
      headers: { 'x-api-key': apiKey },
      payload: {
        name: 'Conta Pessoal',
        provider: 'native',
        merchantName: 'EU MESMO',
        merchantCity: 'SAO PAULO',
        webhookToken: 'whsec_native_token',
      },
    })
    assert.equal(accountRes.statusCode, 201, accountRes.body)
    const accountBody = accountRes.json() as {
      account: { id: string; fee: number; provider: string }
      webhookUrl: string
    }
    assert.equal(accountBody.account.provider, 'native')
    assert.equal(accountBody.account.fee, 0)
    assert.match(accountBody.webhookUrl, /\/v1\/webhooks\/native\//)

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
        'idempotency-key': 'idem-native-1',
      },
      payload: {
        amountCents: 2500,
        description: 'Teste gratis',
        accountId: accountBody.account.id,
      },
    })
    assert.equal(chargeRes.statusCode, 201, chargeRes.body)
    const charge = (
      chargeRes.json() as {
        charge: { id: string; status: string; copyPaste: string; txid: string; fee: number }
      }
    ).charge
    assert.equal(charge.status, 'pending')
    assert.equal(charge.fee, 0)
    assert.ok(charge.copyPaste.includes('br.gov.bcb.pix'))
    assert.ok(charge.copyPaste.includes('123e4567-e89b-12d3-a456-426614174000'))

    const wh = await app.inject({
      method: 'POST',
      url: `/v1/webhooks/native/${accountBody.account.id}?token=whsec_native_token`,
      payload: {
        pix: [
          {
            txid: charge.txid,
            valor: '25.00',
            horario: '2026-08-06T20:00:00.000Z',
            endToEndId: 'E12345678202608062000abcdef',
          },
        ],
      },
    })
    assert.equal(wh.statusCode, 200, wh.body)
    const whBody = wh.json() as { processed: boolean; results: Array<{ status: string }> }
    assert.equal(whBody.processed, true)
    assert.equal(whBody.results[0]?.status, 'paid')

    const getRes = await app.inject({
      method: 'GET',
      url: `/v1/charges/${charge.id}`,
      headers: { 'x-api-key': apiKey },
    })
    assert.equal((getRes.json() as { charge: { status: string } }).charge.status, 'paid')
  })

  it('roteia round_robin entre contas native', async () => {
    const mk = async (name: string) => {
      const a = await app.inject({
        method: 'POST',
        url: '/v1/accounts',
        headers: { 'x-api-key': apiKey },
        payload: {
          name,
          provider: 'native',
          merchantName: name,
          merchantCity: 'CURITIBA',
          webhookToken: `token_${name}_xx`,
        },
      })
      assert.equal(a.statusCode, 201, a.body)
      const id = (a.json() as { account: { id: string } }).account.id
      const k = await app.inject({
        method: 'POST',
        url: `/v1/accounts/${id}/keys`,
        headers: { 'x-api-key': apiKey },
        payload: {
          label: 'chave',
          keyType: 'email',
          keyValue: `${name.toLowerCase()}@pix.local`,
        },
      })
      assert.equal(k.statusCode, 201)
      return id
    }

    await mk('ContaA')
    await mk('ContaB')

    const c1 = await app.inject({
      method: 'POST',
      url: '/v1/charges',
      headers: { 'x-api-key': apiKey },
      payload: { amountCents: 100, routing: 'round_robin' },
    })
    const c2 = await app.inject({
      method: 'POST',
      url: '/v1/charges',
      headers: { 'x-api-key': apiKey },
      payload: { amountCents: 100, routing: 'round_robin' },
    })
    assert.equal(c1.statusCode, 201, c1.body)
    assert.equal(c2.statusCode, 201, c2.body)
    const acc1 = (c1.json() as { charge: { accountId: string } }).charge.accountId
    const acc2 = (c2.json() as { charge: { accountId: string } }).charge.accountId
    assert.notEqual(acc1, acc2)
  })
})
