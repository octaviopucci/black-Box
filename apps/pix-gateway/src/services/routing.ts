import type { Db } from '../db/index.js'
import type { AccountRecord, RoutingStrategy } from '../types.js'
import { getAccount, listAccounts } from './accounts.js'

function getRouteCursor(db: Db): number {
  const row = db.prepare(`SELECT value FROM routing_state WHERE key = 'round_robin'`).get() as
    | { value: string }
    | undefined
  return row ? Number(row.value) || 0 : 0
}

function setRouteCursor(db: Db, value: number): void {
  db.prepare(
    `INSERT INTO routing_state (key, value) VALUES ('round_robin', ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
  ).run(String(value))
}

function activeAccounts(db: Db): AccountRecord[] {
  return listAccounts(db).filter((a) => a.active === 1)
}

export function pickAccount(
  db: Db,
  options: {
    accountId?: string
    routing?: RoutingStrategy
  },
): AccountRecord {
  if (options.accountId) {
    const account = getAccount(db, options.accountId)
    if (!account || !account.active) {
      throw new Error('Conta informada não existe ou está inativa')
    }
    return account
  }

  const accounts = activeAccounts(db)
  if (accounts.length === 0) {
    throw new Error('Nenhuma conta ativa cadastrada. Crie uma conta Asaas primeiro.')
  }

  const strategy = options.routing ?? 'round_robin'

  if (strategy === 'explicit') {
    throw new Error('routing=explicit exige accountId')
  }

  if (strategy === 'least_used_today') {
    const start = new Date()
    start.setHours(0, 0, 0, 0)
    const startIso = start.toISOString()

    let best = accounts[0]!
    let bestCount = Number.POSITIVE_INFINITY

    for (const account of accounts) {
      const row = db
        .prepare(
          `SELECT COUNT(*) AS c FROM charges
           WHERE account_id = ? AND created_at >= ?`,
        )
        .get(account.id, startIso) as { c: number }
      if (row.c < bestCount) {
        best = account
        bestCount = row.c
      }
    }
    return best
  }

  // round_robin
  const cursor = getRouteCursor(db)
  const index = cursor % accounts.length
  setRouteCursor(db, cursor + 1)
  return accounts[index]!
}
