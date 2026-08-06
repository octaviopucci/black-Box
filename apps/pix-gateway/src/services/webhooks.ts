import { customAlphabet } from 'nanoid'
import type { Db } from '../db/index.js'
import { getProvider } from '../providers/asaas.js'
import type { AccountRecord, ProviderKind } from '../types.js'
import { listAccounts, parseCredentials } from './accounts.js'
import { getChargeByProviderId, updateChargeStatus } from './charges.js'

const id = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16)

function now(): string {
  return new Date().toISOString()
}

function findAccountForWebhook(
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
    const matched = accounts.filter((a) => parseCredentials(a.credentialsJson).webhookToken === token)
    if (matched.length === 1) return matched[0]
    if (matched.length > 1) {
      // Token compartilhado: ainda processamos pelo providerChargeId
      return matched[0]
    }
  }

  // Sem token: se só há uma conta do provider, usa ela
  if (accounts.length === 1) return accounts[0]
  return undefined
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
  chargeId: string | null
  status: string | null
  eventId: string
} {
  const provider = getProvider(input.provider)
  const normalized = provider.parseWebhook(input.payload)

  const account = findAccountForWebhook(db, input.provider, input.token, input.accountId)

  // Validação de token quando a conta exige
  if (account) {
    const expected = parseCredentials(account.credentialsJson).webhookToken
    if (expected && input.token !== expected) {
      throw new Error('Webhook token inválido')
    }
  } else if (input.accountId) {
    throw new Error('Conta do webhook não encontrada')
  }

  const eventId = `wh_${id()}`
  db.prepare(
    `INSERT INTO webhook_events (
      id, account_id, provider, event_type, provider_charge_id, payload_json, processed, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
  ).run(
    eventId,
    account?.id ?? null,
    input.provider,
    normalized?.eventType ?? 'UNKNOWN',
    normalized?.providerChargeId ?? null,
    JSON.stringify(input.payload),
    now(),
  )

  if (!normalized?.providerChargeId || !normalized.status) {
    return {
      accepted: true,
      processed: false,
      chargeId: null,
      status: null,
      eventId,
    }
  }

  const charge = getChargeByProviderId(db, input.provider, normalized.providerChargeId)
  if (!charge) {
    return {
      accepted: true,
      processed: false,
      chargeId: null,
      status: normalized.status,
      eventId,
    }
  }

  // Se várias contas compartilham token, garante que a cobrança pertence a uma conta válida
  if (account && charge.accountId !== account.id) {
    const chargeAccountOk = listAccounts(db).some((a) => a.id === charge.accountId)
    if (!chargeAccountOk) {
      return { accepted: true, processed: false, chargeId: charge.id, status: charge.status, eventId }
    }
  }

  const updated = updateChargeStatus(db, charge.id, normalized.status, normalized.paidAt)
  db.prepare(`UPDATE webhook_events SET processed = 1 WHERE id = ?`).run(eventId)

  return {
    accepted: true,
    processed: true,
    chargeId: updated?.id ?? charge.id,
    status: updated?.status ?? charge.status,
    eventId,
  }
}
