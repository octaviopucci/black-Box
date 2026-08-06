import { customAlphabet } from 'nanoid'
import type { Db } from '../db/index.js'
import { getProvider } from '../providers/asaas.js'
import type { ChargeRecord, ChargeStatus, CreateChargeInput } from '../types.js'
import { getPixKey, parseCredentials } from './accounts.js'
import { pickAccount } from './routing.js'

const id = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16)

function now(): string {
  return new Date().toISOString()
}

function mapRow(row: Record<string, unknown>): ChargeRecord {
  return {
    id: row.id as string,
    accountId: row.accountId as string,
    pixKeyId: (row.pixKeyId as string | null) ?? null,
    provider: row.provider as ChargeRecord['provider'],
    providerChargeId: (row.providerChargeId as string | null) ?? null,
    txid: row.txid as string,
    amountCents: row.amountCents as number,
    description: (row.description as string | null) ?? null,
    status: row.status as ChargeStatus,
    copyPaste: (row.copyPaste as string | null) ?? null,
    qrCodeBase64: (row.qrCodeBase64 as string | null) ?? null,
    expiresAt: (row.expiresAt as string | null) ?? null,
    paidAt: (row.paidAt as string | null) ?? null,
    externalRef: (row.externalRef as string | null) ?? null,
    idempotencyKey: (row.idempotencyKey as string | null) ?? null,
    rawJson: (row.rawJson as string | null) ?? null,
    createdAt: row.createdAt as string,
    updatedAt: row.updatedAt as string,
  }
}

const selectSql = `
  SELECT id,
         account_id AS accountId,
         pix_key_id AS pixKeyId,
         provider,
         provider_charge_id AS providerChargeId,
         txid,
         amount_cents AS amountCents,
         description,
         status,
         copy_paste AS copyPaste,
         qr_code_base64 AS qrCodeBase64,
         expires_at AS expiresAt,
         paid_at AS paidAt,
         external_ref AS externalRef,
         idempotency_key AS idempotencyKey,
         raw_json AS rawJson,
         created_at AS createdAt,
         updated_at AS updatedAt
  FROM charges
`

export function getCharge(db: Db, chargeId: string): ChargeRecord | undefined {
  const row = db.prepare(`${selectSql} WHERE id = ?`).get(chargeId) as Record<string, unknown> | undefined
  return row ? mapRow(row) : undefined
}

export function getChargeByIdempotency(db: Db, key: string): ChargeRecord | undefined {
  const row = db.prepare(`${selectSql} WHERE idempotency_key = ?`).get(key) as
    | Record<string, unknown>
    | undefined
  return row ? mapRow(row) : undefined
}

export function getChargeByProviderId(
  db: Db,
  provider: string,
  providerChargeId: string,
): ChargeRecord | undefined {
  const row = db
    .prepare(`${selectSql} WHERE provider = ? AND provider_charge_id = ?`)
    .get(provider, providerChargeId) as Record<string, unknown> | undefined
  return row ? mapRow(row) : undefined
}

export function listCharges(db: Db, limit = 50): ChargeRecord[] {
  const rows = db.prepare(`${selectSql} ORDER BY created_at DESC LIMIT ?`).all(limit) as Record<
    string,
    unknown
  >[]
  return rows.map(mapRow)
}

export function publicCharge(charge: ChargeRecord) {
  return {
    id: charge.id,
    accountId: charge.accountId,
    pixKeyId: charge.pixKeyId,
    provider: charge.provider,
    providerChargeId: charge.providerChargeId,
    txid: charge.txid,
    amountCents: charge.amountCents,
    description: charge.description,
    status: charge.status,
    copyPaste: charge.copyPaste,
    qrCodeBase64: charge.qrCodeBase64,
    expiresAt: charge.expiresAt,
    paidAt: charge.paidAt,
    externalRef: charge.externalRef,
    createdAt: charge.createdAt,
    updatedAt: charge.updatedAt,
  }
}

export async function createCharge(
  db: Db,
  input: CreateChargeInput,
  idempotencyKey?: string,
): Promise<ChargeRecord> {
  if (idempotencyKey) {
    const existing = getChargeByIdempotency(db, idempotencyKey)
    if (existing) return existing
  }

  if (!Number.isInteger(input.amountCents) || input.amountCents <= 0) {
    throw new Error('amountCents deve ser um inteiro positivo (centavos)')
  }

  let pixKeyId: string | null = null
  if (input.pixKeyId) {
    const key = getPixKey(db, input.pixKeyId)
    if (!key || !key.active) throw new Error('Chave PIX não encontrada ou inativa')
    pixKeyId = key.id
    if (input.accountId && input.accountId !== key.accountId) {
      throw new Error('pixKeyId não pertence à accountId informada')
    }
    input.accountId = key.accountId
  }

  const account = pickAccount(db, {
    accountId: input.accountId,
    routing: input.routing,
  })

  const credentials = parseCredentials(account.credentialsJson)
  const provider = getProvider(account.provider)
  const created = await provider.createCharge(input, credentials)

  const chargeId = `chg_${id()}`
  const ts = now()

  db.prepare(
    `INSERT INTO charges (
      id, account_id, pix_key_id, provider, provider_charge_id, txid, amount_cents, description,
      status, copy_paste, qr_code_base64, expires_at, paid_at, external_ref, idempotency_key,
      raw_json, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    chargeId,
    account.id,
    pixKeyId,
    account.provider,
    created.providerChargeId,
    created.txid,
    input.amountCents,
    input.description ?? null,
    'pending',
    created.copyPaste,
    created.qrCodeBase64,
    created.expiresAt,
    null,
    input.externalRef ?? null,
    idempotencyKey ?? null,
    JSON.stringify(created.raw),
    ts,
    ts,
  )

  return getCharge(db, chargeId)!
}

export function updateChargeStatus(
  db: Db,
  chargeId: string,
  status: ChargeStatus,
  paidAt: string | null = null,
): ChargeRecord | undefined {
  const current = getCharge(db, chargeId)
  if (!current) return undefined

  // Não regride de paid
  if (current.status === 'paid' && status !== 'refunded') {
    return current
  }

  db.prepare(
    `UPDATE charges SET status = ?, paid_at = COALESCE(?, paid_at), updated_at = ? WHERE id = ?`,
  ).run(status, paidAt, now(), chargeId)

  return getCharge(db, chargeId)
}

/** Reconcilia com o PSP (fallback se webhook falhar). */
export async function syncChargeFromProvider(db: Db, chargeId: string): Promise<ChargeRecord> {
  const charge = getCharge(db, chargeId)
  if (!charge) throw new Error('Cobrança não encontrada')
  if (!charge.providerChargeId) throw new Error('Cobrança sem providerChargeId')

  const account = db
    .prepare(
      `SELECT id, name, provider, credentials_json AS credentialsJson, active,
              created_at AS createdAt, updated_at AS updatedAt FROM accounts WHERE id = ?`,
    )
    .get(charge.accountId) as
    | {
        id: string
        credentialsJson: string
        provider: 'asaas'
      }
    | undefined

  if (!account) throw new Error('Conta da cobrança não encontrada')

  const provider = getProvider(account.provider)
  const remote = await provider.getCharge(charge.providerChargeId, parseCredentials(account.credentialsJson))
  return updateChargeStatus(db, charge.id, remote.status, remote.paidAt) ?? charge
}
