import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { get, put, list } from '@vercel/blob'
import type {
  AccountRecord,
  ChargeRecord,
  PixKeyRecord,
  WebhookEventRecord,
} from '../types.js'

const BLOB_PATHNAME = 'pix-gateway/store.json'

export interface GatewayStore {
  accounts: AccountRecord[]
  pixKeys: PixKeyRecord[]
  charges: ChargeRecord[]
  webhookEvents: WebhookEventRecord[]
  routing: Record<string, string>
}

function emptyStore(): GatewayStore {
  return {
    accounts: [],
    pixKeys: [],
    charges: [],
    webhookEvents: [],
    routing: {},
  }
}

export class JsonDatabase {
  private store: GatewayStore
  private path: string
  private dirty = false

  private constructor(path: string, store: GatewayStore) {
    this.path = path
    this.store = store
  }

  static async open(path: string): Promise<JsonDatabase> {
    mkdirSync(dirname(path), { recursive: true })
    let store = emptyStore()

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const listed = await list({ prefix: BLOB_PATHNAME, limit: 1 })
        const blob = listed.blobs.find((b) => b.pathname === BLOB_PATHNAME)
        if (blob) {
          const res = await fetch(blob.url)
          if (res.ok) {
            const parsed = (await res.json()) as Partial<GatewayStore>
            store = { ...emptyStore(), ...parsed, routing: { ...emptyStore().routing, ...parsed.routing } }
          }
        }
      } catch (err) {
        console.warn('[pix-gateway] blob hydrate failed', err)
      }
    }

    if (existsSync(path)) {
      try {
        const parsed = JSON.parse(readFileSync(path, 'utf8')) as Partial<GatewayStore>
        store = {
          ...emptyStore(),
          ...parsed,
          routing: { ...emptyStore().routing, ...(parsed.routing || {}) },
        }
      } catch {
        /* keep blob/empty */
      }
    }

    return new JsonDatabase(path, store)
  }

  data(): GatewayStore {
    return this.store
  }

  markDirty(): void {
    this.dirty = true
  }

  async persist(): Promise<void> {
    if (!this.dirty) return
    writeFileSync(this.path, JSON.stringify(this.store, null, 2))
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        await put(BLOB_PATHNAME, JSON.stringify(this.store), {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: 'application/json',
          token: process.env.BLOB_READ_WRITE_TOKEN,
        })
      } catch (err) {
        console.warn('[pix-gateway] blob persist failed', err)
      }
    }
    this.dirty = false
  }
}

export type Db = JsonDatabase

export function resolveDatabasePath(configured: string): string {
  if (process.env.VERCEL || process.env.VERCEL_ENV) {
    return '/tmp/pix-gateway-store.json'
  }
  return configured.endsWith('.db')
    ? configured.replace(/\.db$/, '.json')
    : configured.includes('.json')
      ? configured
      : './data/pix-gateway-store.json'
}
