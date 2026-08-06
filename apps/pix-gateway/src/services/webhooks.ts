import { customAlphabet } from 'nanoid'
import type { Db } from '../db/json-store.js'
import { getProvider } from '../providers/asaas.js'
import { parseNativeWebhook } from '../providers/native.js'
import type { AccountRecord, ProviderKind, WebhookEventRecord } from '../types.js'
import {
  listAccounts,
  parseAsaasCredentials,
  parseNativeCredentials,
} from './accounts.js'
import { getChargeByProviderId, getChargeByTxid, updateChargeStatus } from './charges.js'

const id = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16)

function now(): string {
  return new Date().toISOString()
}

function findAccount(
  db: Db,
  provider: ProviderKind,
  token: string | undefined,
  accountId: string | undefined,
): AccountRecord | undefined {
  const accounts = listAccounts(db).filter((a) => a.provider === provider && a.active === 1)

  if (accountId) {
    return accounts.find((a) => a.id === accountId)
  }

  if (token) {
    const matched = accounts.filter((a) => {
      if (a.provider === 'native') {
        return parseNativeCredentials(a.credentialsJson).webhookToken === token
      }
      return parseAsaasCredentials(a.credentialsJson).webhookToken === token
    })
    if (matched.length >= 1) return matched[0]
  }

  if (accounts.length === 1) return accounts[0]
  return undefined
}

function assertWebhookToken(account: AccountRecord | undefined, token: string | undefined): void {
  if (!account) return
  const expected =
    account.provider === 'native'
      ? parseNativeCredentials(account.credentialsJson).webhookToken
      : parseAsaasCredentials(account.credentialsJson).webhookToken
  if (expected && token !== expected) {
    throw new Error('Webhook token inválido')
  }
}

export function processProviderWebhook(
  db: Db,
  input: {
    provider: ProviderKind
    payload: unknown
    token?: string
    accountId?: string
  },
): {
  accepted: boolean
  processed: boolean
  results: Array<{ chargeId: string | null; status: string | null; txid?: string }>
  eventId: string
} {
  const account = findAccount(db, input.provider, input.token, input.accountId)
  if (input.accountId && !account) throw new Error('Conta do webhook não encontrada')
  assertWebhookToken(account, input.token)

  const eventId = `wh_${id()}`

  if (input.provider === 'native') {
    const events = parseNativeWebhook(input.payload)
    const wh: WebhookEventRecord = {
      id: eventId,
      accountId: account?.id ?? null,
      provider: 'native',
      eventType: events[0]?.eventType ?? 'UNKNOWN',
      providerChargeId: events[0]?.providerChargeId ?? null,
      payloadJson: JSON.stringify(input.payload),
      processed: 0,
      createdAt: now(),
    }
    db.data().webhookEvents.push(wh)
    db.markDirty()

    const results: Array<{ chargeId: string | null; status: string | null; txid?: string }> = []
    let anyProcessed = false

    for (const ev of events) {
      const txid = ev.matchTxid ?? ev.providerChargeId
      const charge =
        getChargeByTxid(db, txid) ?? getChargeByProviderId(db, 'native', ev.providerChargeId)

      if (!charge || !ev.status) {
        results.push({ chargeId: null, status: ev.status, txid })
        continue
      }

      if (account && charge.accountId !== account.id) {
        results.push({ chargeId: charge.id, status: charge.status, txid })
        continue
      }

      const updated = updateChargeStatus(db, charge.id, ev.status, ev.paidAt)
      anyProcessed = true
      results.push({
        chargeId: updated?.id ?? charge.id,
        status: updated?.status ?? charge.status,
        txid,
      })
    }

    if (anyProcessed) {
      wh.processed = 1
      db.markDirty()
    }

    return { accepted: true, processed: anyProcessed, results, eventId }
  }

  const provider = getProvider('asaas')
  const normalized = provider.parseWebhook(input.payload)

  const wh: WebhookEventRecord = {
    id: eventId,
    accountId: account?.id ?? null,
    provider: 'asaas',
    eventType: normalized?.eventType ?? 'UNKNOWN',
    providerChargeId: normalized?.providerChargeId ?? null,
    payloadJson: JSON.stringify(input.payload),
    processed: 0,
    createdAt: now(),
  }
  db.data().webhookEvents.push(wh)
  db.markDirty()

  if (!normalized?.providerChargeId || !normalized.status) {
    return {
      accepted: true,
      processed: false,
      results: [{ chargeId: null, status: null }],
      eventId,
    }
  }

  const charge = getChargeByProviderId(db, 'asaas', normalized.providerChargeId)
  if (!charge) {
    return {
      accepted: true,
      processed: false,
      results: [{ chargeId: null, status: normalized.status }],
      eventId,
    }
  }

  const updated = updateChargeStatus(db, charge.id, normalized.status, normalized.paidAt)
  wh.processed = 1
  db.markDirty()

  return {
    accepted: true,
    processed: true,
    results: [
      {
        chargeId: updated?.id ?? charge.id,
        status: updated?.status ?? charge.status,
      },
    ],
    eventId,
  }
}
