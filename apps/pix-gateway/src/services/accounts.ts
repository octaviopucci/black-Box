import { customAlphabet } from 'nanoid'
import type { Db } from '../db/index.js'
import type {
  AccountRecord,
  AsaasCredentials,
  PixKeyRecord,
  PixKeyType,
  ProviderKind,
} from '../types.js'

const id = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16)

function now(): string {
  return new Date().toISOString()
}

export function parseCredentials(json: string): AsaasCredentials {
  const data = JSON.parse(json) as AsaasCredentials
  if (!data.apiKey || typeof data.apiKey !== 'string') {
    throw new Error('credentials.apiKey é obrigatório')
  }
  return {
    apiKey: data.apiKey,
    apiUrl: data.apiUrl ?? 'https://api-sandbox.asaas.com',
    webhookToken: data.webhookToken,
    defaultCustomerId: data.defaultCustomerId,
  }
}

export function createAccount(
  db: Db,
  input: {
    name: string
    provider?: ProviderKind
    apiKey: string
    apiUrl?: string
    webhookToken?: string
    defaultCustomerId?: string
  },
): AccountRecord {
  const account: AccountRecord = {
    id: `acc_${id()}`,
    name: input.name,
    provider: input.provider ?? 'asaas',
    credentialsJson: JSON.stringify({
      apiKey: input.apiKey,
      apiUrl: input.apiUrl ?? 'https://api-sandbox.asaas.com',
      webhookToken: input.webhookToken,
      defaultCustomerId: input.defaultCustomerId,
    } satisfies AsaasCredentials),
    active: 1,
    createdAt: now(),
    updatedAt: now(),
  }

  db.prepare(
    `INSERT INTO accounts (id, name, provider, credentials_json, active, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    account.id,
    account.name,
    account.provider,
    account.credentialsJson,
    account.active,
    account.createdAt,
    account.updatedAt,
  )

  return account
}

export function listAccounts(db: Db): AccountRecord[] {
  return db
    .prepare(
      `SELECT id, name, provider, credentials_json AS credentialsJson, active,
              created_at AS createdAt, updated_at AS updatedAt
       FROM accounts ORDER BY created_at ASC`,
    )
    .all() as unknown as AccountRecord[]
}

export function getAccount(db: Db, accountId: string): AccountRecord | undefined {
  return db
    .prepare(
      `SELECT id, name, provider, credentials_json AS credentialsJson, active,
              created_at AS createdAt, updated_at AS updatedAt
       FROM accounts WHERE id = ?`,
    )
    .get(accountId) as unknown as AccountRecord | undefined
}

export function publicAccount(account: AccountRecord) {
  const creds = parseCredentials(account.credentialsJson)
  return {
    id: account.id,
    name: account.name,
    provider: account.provider,
    active: Boolean(account.active),
    apiUrl: creds.apiUrl,
    hasWebhookToken: Boolean(creds.webhookToken),
    createdAt: account.createdAt,
    updatedAt: account.updatedAt,
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

  db.prepare(
    `INSERT INTO pix_keys (id, account_id, label, key_type, key_value, active, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(key.id, key.accountId, key.label, key.keyType, key.keyValue, key.active, key.createdAt)

  return key
}

export function listPixKeys(db: Db, accountId?: string): PixKeyRecord[] {
  if (accountId) {
    return db
      .prepare(
        `SELECT id, account_id AS accountId, label, key_type AS keyType, key_value AS keyValue,
                active, created_at AS createdAt
         FROM pix_keys WHERE account_id = ? ORDER BY created_at ASC`,
      )
      .all(accountId) as unknown as PixKeyRecord[]
  }
  return db
    .prepare(
      `SELECT id, account_id AS accountId, label, key_type AS keyType, key_value AS keyValue,
              active, created_at AS createdAt
       FROM pix_keys ORDER BY created_at ASC`,
    )
    .all() as unknown as PixKeyRecord[]
}

export function getPixKey(db: Db, keyId: string): PixKeyRecord | undefined {
  return db
    .prepare(
      `SELECT id, account_id AS accountId, label, key_type AS keyType, key_value AS keyValue,
              active, created_at AS createdAt
       FROM pix_keys WHERE id = ?`,
    )
    .get(keyId) as unknown as PixKeyRecord | undefined
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
