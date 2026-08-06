import type { Db } from '../db/json-store.js'
import type { AccountRecord, RoutingStrategy } from '../types.js'
import { getAccount, listAccounts } from './accounts.js'

function getRouteCursor(db: Db): number {
  return Number(db.data().routing.round_robin) || 0
}

function setRouteCursor(db: Db, value: number): void {
  db.data().routing.round_robin = String(value)
  db.markDirty()
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
    throw new Error('Nenhuma conta ativa cadastrada. Crie uma conta native e adicione chaves Pix.')
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
      const c = db
        .data()
        .charges.filter((ch) => ch.accountId === account.id && ch.createdAt >= startIso).length
      if (c < bestCount) {
        best = account
        bestCount = c
      }
    }
    return best
  }

  const cursor = getRouteCursor(db)
  const index = cursor % accounts.length
  setRouteCursor(db, cursor + 1)
  return accounts[index]!
}
