import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { buildPixBrCode, crc16 } from '../src/utils/brcode.js'
import { parseNativeWebhook } from '../src/providers/native.js'

describe('brcode', () => {
  it('gera payload válido com CRC', () => {
    const payload = buildPixBrCode({
      pixKey: 'teste@exemplo.com',
      amountCents: 1500,
      merchantName: 'Loja Teste',
      merchantCity: 'Sao Paulo',
      txid: 'abc123TXID001',
      description: 'pedido',
    })
    assert.ok(payload.startsWith('000201'))
    assert.ok(payload.includes('br.gov.bcb.pix'))
    assert.ok(payload.includes('teste@exemplo.com'))
    assert.ok(payload.includes('15.00'))
    const withoutCrc = payload.slice(0, -4)
    assert.equal(payload.slice(-4), crc16(withoutCrc))
  })
})

describe('parseNativeWebhook', () => {
  it('lê formato Bacen pix[]', () => {
    const events = parseNativeWebhook({
      pix: [{ txid: 'abc123TXID001', valor: '15.00', horario: '2026-08-06T12:00:00Z' }],
    })
    assert.equal(events.length, 1)
    assert.equal(events[0]?.status, 'paid')
    assert.equal(events[0]?.matchTxid, 'abc123TXID001')
  })
})
