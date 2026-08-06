import { customAlphabet } from 'nanoid'
import type { Db } from '../db/json-store.js'
import { getProvider as getAsaasProvider } from '../providers/asaas.js'
import { nativeCreateCharge } from '../providers/native.js'
import type { ChargeRecord, ChargeStatus, CreateChargeInput } from '../types.js'
import {
  getAccount,
  getPixKey,
  parseAsaasCredentials,
  parseNativeCredentials,
  pickPixKeyForAccount,
} from './accounts.js'
import { pickAccount } from './routing.js'

const id = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16)

function now(): string {
  return new Date().toISOString()
}

export function getCharge(db: Db, chargeId: string): ChargeRecord | undefined {
  return db.data().charges.find((c) => c.id === chargeId)
}

export function getChargeByIdempotency(db: Db, key: string): ChargeRecord | undefined {
  return db.data().charges.find((c) => c.idempotencyKey === key)
}

export function getChargeByProviderId(
  db: Db,
  provider: string,
  providerChargeId: string,
): ChargeRecord | undefined {
  return db
    .data()
    .charges.find((c) => c.provider === provider && c.providerChargeId === providerChargeId)
}

export function getChargeByTxid(db: Db, txid: string): ChargeRecord | undefined {
  const clean = txid.replace(/[^a-zA-Z0-9]/g, '')
  return db.data().charges.find((c) => c.txid === clean)
}

export function listCharges(db: Db, limit = 50): ChargeRecord[] {
  return [...db.data().charges]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
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
    fee: charge.provider === 'native' ? 0 : undefined,
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

  let created
  if (account.provider === 'native') {
    const pixKey = pixKeyId ? getPixKey(db, pixKeyId)! : pickPixKeyForAccount(db, account.id)
    pixKeyId = pixKey.id
    created = await nativeCreateCharge(input, {
      credentials: parseNativeCredentials(account.credentialsJson),
      pixKey,
    })
  } else {
    const credentials = parseAsaasCredentials(account.credentialsJson)
    const provider = getAsaasProvider('asaas')
    created = await provider.createCharge(input, credentials)
  }

  const ts = now()
  const charge: ChargeRecord = {
    id: `chg_${id()}`,
    accountId: account.id,
    pixKeyId,
    provider: account.provider,
    providerChargeId: created.providerChargeId,
    txid: created.txid,
    amountCents: input.amountCents,
    description: input.description ?? null,
    status: 'pending',
    copyPaste: created.copyPaste,
    qrCodeBase64: created.qrCodeBase64,
    expiresAt: created.expiresAt,
    paidAt: null,
    externalRef: input.externalRef ?? null,
    idempotencyKey: idempotencyKey ?? null,
    rawJson: JSON.stringify(created.raw),
    createdAt: ts,
    updatedAt: ts,
  }

  db.data().charges.push(charge)
  db.markDirty()
  return charge
}

export function updateChargeStatus(
  db: Db,
  chargeId: string,
  status: ChargeStatus,
  paidAt: string | null = null,
): ChargeRecord | undefined {
  const current = getCharge(db, chargeId)
  if (!current) return undefined

  if (current.status === 'paid' && status !== 'refunded') {
    return current
  }

  current.status = status
  if (paidAt) current.paidAt = paidAt
  current.updatedAt = now()
  db.markDirty()
  return current
}

export async function syncChargeFromProvider(db: Db, chargeId: string): Promise<ChargeRecord> {
  const charge = getCharge(db, chargeId)
  if (!charge) throw new Error('Cobrança não encontrada')

  if (charge.provider === 'native') {
    if (
      charge.status === 'pending' &&
      charge.expiresAt &&
      new Date(charge.expiresAt).getTime() < Date.now()
    ) {
      return updateChargeStatus(db, charge.id, 'expired') ?? charge
    }
    return charge
  }

  if (!charge.providerChargeId) throw new Error('Cobrança sem providerChargeId')

  const account = getAccount(db, charge.accountId)
  if (!account) throw new Error('Conta da cobrança não encontrada')

  const provider = getAsaasProvider('asaas')
  const remote = await provider.getCharge(
    charge.providerChargeId,
    parseAsaasCredentials(account.credentialsJson),
  )
  return updateChargeStatus(db, charge.id, remote.status, remote.paidAt) ?? charge
}
