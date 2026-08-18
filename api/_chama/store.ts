import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { createHash, randomBytes } from 'node:crypto'
import { list, put } from '@vercel/blob'

const BLOB_PATHNAME = 'chama/store.json'
const FILE_PATH =
  process.env.VERCEL || process.env.VERCEL_ENV
    ? '/tmp/chama-store.json'
    : './data/chama-store.json'

export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)
}

function blobAuthOptions(): { token?: string } {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  return token ? { token } : {}
}

export interface InstagramConnection {
  workspaceId: string
  pageId: string
  pageName: string
  pageAccessToken: string
  igUserId: string
  igUsername: string
  connectedAt: string
  webhookSubscribed: boolean
}

export interface ServerAutomation {
  id: string
  workspaceId: string
  name: string
  keywords: string[]
  replyText: string
  active: boolean
  matches: number
  channel: 'instagram'
  updatedAt: string
}

export interface ReplyLog {
  id: string
  workspaceId: string
  commentId: string
  commentText: string
  fromUsername?: string
  automationId?: string
  status: 'sent' | 'skipped' | 'error'
  detail?: string
  at: string
}

export interface ChamaStoreData {
  connections: Record<string, InstagramConnection> // key: workspaceId
  automations: Record<string, ServerAutomation[]> // key: workspaceId
  processedComments: Record<string, string> // commentId -> replyLogId
  replyLogs: ReplyLog[]
}

function emptyStore(): ChamaStoreData {
  return {
    connections: {},
    automations: {},
    processedComments: {},
    replyLogs: [],
  }
}

let cached: ChamaStore | null = null

export class ChamaStore {
  private dataStore: ChamaStoreData
  private dirty = false

  private constructor(data: ChamaStoreData) {
    this.dataStore = data
  }

  static async open(): Promise<ChamaStore> {
    if (cached) return cached
    mkdirSync(dirname(FILE_PATH), { recursive: true })
    let data = emptyStore()

    if (blobConfigured()) {
      try {
        const listed = await list({ prefix: BLOB_PATHNAME, limit: 1, ...blobAuthOptions() })
        const hit = listed.blobs.find((b) => b.pathname === BLOB_PATHNAME)
        if (hit?.url) {
          const res = await fetch(hit.url)
          if (res.ok) data = { ...emptyStore(), ...(await res.json()) }
        }
      } catch {
        // fallback file
      }
    }

    if (existsSync(FILE_PATH)) {
      try {
        data = { ...emptyStore(), ...JSON.parse(readFileSync(FILE_PATH, 'utf8')) }
      } catch {
        // keep empty/blob
      }
    }

    cached = new ChamaStore(data)
    return cached
  }

  data(): ChamaStoreData {
    return this.dataStore
  }

  markDirty() {
    this.dirty = true
  }

  async persist() {
    if (!this.dirty) return
    mkdirSync(dirname(FILE_PATH), { recursive: true })
    writeFileSync(FILE_PATH, JSON.stringify(this.dataStore, null, 2))
    if (blobConfigured()) {
      await put(BLOB_PATHNAME, JSON.stringify(this.dataStore), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
        ...blobAuthOptions(),
      })
    }
    this.dirty = false
  }
}

export function uid(prefix = 'id') {
  return `${prefix}_${randomBytes(8).toString('hex')}`
}

export function hashState(raw: string) {
  return createHash('sha256').update(raw).digest('hex').slice(0, 24)
}

export function metaConfigured() {
  return Boolean(
    process.env.CHAMA_META_APP_ID &&
      process.env.CHAMA_META_APP_SECRET &&
      process.env.CHAMA_META_VERIFY_TOKEN,
  )
}

export function publicBaseUrl() {
  return (
    process.env.CHAMA_PUBLIC_BASE_URL ||
    process.env.PUBLIC_BASE_URL ||
    'https://blckbox.vercel.app'
  ).replace(/\/$/, '')
}
