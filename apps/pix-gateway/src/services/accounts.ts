import { customAlphabet } from 'nanoid'
import type { Db } from '../db/json-store.js'
import type {
  AccountRecord,
  AsaasCredentials,
  NativeCredentials,
  PixKeyRecord,
  PixKeyType,
  ProviderKind,
} from '../types.js'

const id = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16)

function now(): string {
  return new Date().toISOString()
}

export function parseNativeCredentials(json: string): NativeCredentials {
  const data = JSON.parse(json) as NativeCredentials
  if (!data.merchantName || !data.merchantCity) {
    throw new Error('credentials.merchantName e merchantCity são obrigatórios no modo native')
  }
  return {
    merchantName: data.merchantName,
    merchantCity: data.merchantCity,
    webhookToken: data.webhookToken,
  }
}

export function parseAsaasCredentials(json: string): AsaasCredentials {
  const data = JSON.parse(json) as AsaasCredentials
  if (!data.apiKey || typeof data.apiKey !== 'string') {
    throw new Error('credentials.apiKey é obrigatório para Asaas')
  }
  return {
    apiKey: data.apiKey,
    apiUrl: data.apiUrl ?? 'https://api-sandbox.asaas.com',
    webhookToken: data.webhookToken,
    defaultCustomerId: data.defaultCustomerId,
  }
}

export function parseCredentials(json: string): AsaasCredentials {
  return parseAsaasCredentials(json)
}

export function createAccount(
  db: Db,
  input: {
    name: string
    provider?: ProviderKind
    merchantName?: string
    merchantCity?: string
    webhookToken?: string
    apiKey?: string
    apiUrl?: string
    defaultCustomerId?: string
  },
): AccountRecord {
  const provider: ProviderKind = input.provider ?? 'native'
  let credentialsJson: string

  if (provider === 'native') {
    credentialsJson = JSON.stringify({
      merchantName: input.merchantName ?? input.name,
      merchantCity: input.merchantCity ?? 'SAO PAULO',
      webhookToken: input.webhookToken,
    } satisfies NativeCredentials)
  } else {
    if (!input.apiKey) throw new Error('apiKey é obrigatório para provider asaas')
    credentialsJson = JSON.stringify({
      apiKey: input.apiKey,
      apiUrl: input.apiUrl ?? 'https://api-sandbox.asaas.com',
      webhookToken: input.webhookToken,
      defaultCustomerId: input.defaultCustomerId,
    } satisfies AsaasCredentials)
  }

  const account: AccountRecord = {
    id: `acc_${id()}`,
    name: input.name,
    provider,
    credentialsJson,
    active: 1,
    createdAt: now(),
    updatedAt: now(),
  }

  db.data().accounts.push(account)
  db.markDirty()
  return account
}

export function listAccounts(db: Db): AccountRecord[] {
  return [...db.data().accounts].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export function getAccount(db: Db, accountId: string): AccountRecord | undefined {
  return db.data().accounts.find((a) => a.id === accountId)
}

export function publicAccount(account: AccountRecord) {
  const base = {
    id: account.id,
    name: account.name,
    provider: account.provider,
    active: Boolean(account.active),
    fee: account.provider === 'native' ? 0 : 'asaas',
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
  }

  if (account.provider === 'native') {
    const creds = parseNativeCredentials(account.credentialsJson)
    return {
      ...base,
      merchantName: creds.merchantName,
      merchantCity: creds.merchantCity,
      hasWebhookToken: Boolean(creds.webhookToken),
    }
  }

  const creds = parseAsaasCredentials(account.credentialsJson)
  return {
    ...base,
    apiUrl: creds.apiUrl,
    hasWebhookToken: Boolean(creds.webhookToken),
  }
}

export function createPixKey(
  db: Db,
  input: {
    accountId: string
    label: string
    keyType: PixKeyType
    keyValue: string
  },
): PixKeyRecord {
  const account = getAccount(db, input.accountId)
  if (!account) throw new Error('Conta não encontrada')

  const key: PixKeyRecord = {
    id: `key_${id()}`,
    accountId: input.accountId,
    label: input.label,
    keyType: input.keyType,
    keyValue: input.keyValue.trim(),
    active: 1,
    createdAt: now(),
  }

  db.data().pixKeys.push(key)
  db.markDirty()
  return key
}

export function listPixKeys(db: Db, accountId?: string): PixKeyRecord[] {
  const keys = db.data().pixKeys
  const filtered = accountId ? keys.filter((k) => k.accountId === accountId) : keys
  return [...filtered].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
}

export function getPixKey(db: Db, keyId: string): PixKeyRecord | undefined {
  return db.data().pixKeys.find((k) => k.id === keyId)
}

export function pickPixKeyForAccount(db: Db, accountId: string): PixKeyRecord {
  const keys = listPixKeys(db, accountId).filter((k) => k.active === 1)
  if (keys.length === 0) {
    throw new Error(
      'Conta native precisa de ao menos uma chave Pix. POST /v1/accounts/:id/keys',
    )
  }

  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const startIso = start.toISOString()
  let best = keys[0]!
  let bestCount = Number.POSITIVE_INFINITY
  for (const key of keys) {
    const c = db
      .data()
      .charges.filter((ch) => ch.pixKeyId === key.id && ch.createdAt >= startIso).length
    if (c < bestCount) {
      best = key
      bestCount = c
    }
  }
  return best
}

export function publicPixKey(key: PixKeyRecord) {
  return {
    id: key.id,
    accountId: key.accountId,
    label: key.label,
    keyType: key.keyType,
    keyValue: key.keyValue,
    active: Boolean(key.active),
    createdAt: key.createdAt,
  }
}
