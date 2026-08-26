import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { list, put } from '@vercel/blob'

const BLOB_PATHNAME = 'lp-motors/store.json'
const FILE_PATH =
  process.env.VERCEL || process.env.VERCEL_ENV
    ? '/tmp/lp-motors-store.json'
    : './data/lp-motors-store.json'

/** Blob ativo via token clássico OU OIDC moderno (BLOB_STORE_ID na Vercel). */
export function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID)
}

/** Só passa `token` quando existe — senão o SDK usa OIDC + BLOB_STORE_ID. */
function blobAuthOptions(): { token?: string } {
  const token = process.env.BLOB_READ_WRITE_TOKEN
  return token ? { token } : {}
}

export interface CloudSession {
  userId: string
  username: string
  nome: string
  role: string
  organizationId: string
  organizationName?: string
  organizationSlug?: string
}

export interface CloudUser {
  id: string
  organizationId: string
  username: string
  passwordHash: string
  nome: string
  role: string
  active: boolean
}

export interface CloudOrg {
  id: string
  name: string
  slug: string
  createdAt: string
}

export interface OrgDatabaseRecord {
  version: number
  updatedAt: string
  data: unknown
}

export interface LpMotorsStore {
  organizations: Record<string, CloudOrg>
  users: Record<string, CloudUser>
  databases: Record<string, OrgDatabaseRecord>
  tokens: Record<string, { organizationId: string; userId: string; createdAt: string }>
}

function emptyStore(): LpMotorsStore {
  return {
    organizations: {},
    users: {},
    databases: {},
    tokens: {},
  }
}

export function hashPassword(password: string): string {
  return createHash('sha256').update(`lp-motors:${password}`).digest('hex')
}

export function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return timingSafeEqual(ba, bb)
}

export function slugifyStoreName(name: string): string {
  const base = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32)
  return base || 'loja'
}

const RESERVED_SLUGS = new Set([
  'lp-motors',
  'admin',
  'api',
  'login',
  'cadastro',
  'www',
  'app',
  'gestor',
])

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug)
}

export function issueToken(): string {
  return randomBytes(24).toString('hex')
}

let cached: JsonStore | null = null

export class JsonStore {
  private store: LpMotorsStore
  private dirty = false

  private constructor(store: LpMotorsStore) {
    this.store = store
  }

  static async open(): Promise<JsonStore> {
    if (cached) return cached
    mkdirSync(dirname(FILE_PATH), { recursive: true })
    let store = emptyStore()
    let hydratedFromBlob = false

    // Blob is the source of truth for multi-device. Never let a stale /tmp
    // file overwrite a successful Blob hydrate (Vercel instances share Blob,
    // not /tmp).
    if (blobConfigured()) {
      try {
        const listed = await list({
          prefix: BLOB_PATHNAME,
          limit: 1,
          ...blobAuthOptions(),
        })
        const blob = listed.blobs.find((b) => b.pathname === BLOB_PATHNAME)
        if (blob) {
          const res = await fetch(blob.url)
          if (res.ok) {
            store = { ...emptyStore(), ...((await res.json()) as Partial<LpMotorsStore>) }
            hydratedFromBlob = true
            try {
              writeFileSync(FILE_PATH, JSON.stringify(store))
            } catch {
              /* cache best-effort */
            }
          }
        }
      } catch (err) {
        console.warn('[lp-motors] blob hydrate failed', err)
      }
    }

    if (!hydratedFromBlob && existsSync(FILE_PATH)) {
      try {
        const parsed = JSON.parse(readFileSync(FILE_PATH, 'utf8')) as Partial<LpMotorsStore>
        store = { ...emptyStore(), ...parsed }
      } catch {
        /* keep */
      }
    }

    cached = new JsonStore(store)
    return cached
  }

  data(): LpMotorsStore {
    return this.store
  }

  markDirty(): void {
    this.dirty = true
  }

  async persist(): Promise<void> {
    if (!this.dirty) return
    writeFileSync(FILE_PATH, JSON.stringify(this.store))
    if (blobConfigured()) {
      await put(BLOB_PATHNAME, JSON.stringify(this.store), {
        access: 'private',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
        ...blobAuthOptions(),
      })
    }
    this.dirty = false
  }

  findUserByUsername(username: string): CloudUser | null {
    const key = username.toLowerCase()
    return (
      Object.values(this.store.users).find((u) => u.username.toLowerCase() === key && u.active) ||
      null
    )
  }

  findUsersByUsername(username: string): CloudUser[] {
    const key = username.toLowerCase()
    return Object.values(this.store.users).filter(
      (u) => u.username.toLowerCase() === key && u.active,
    )
  }

  findOrgBySlug(slug: string): CloudOrg | null {
    const key = slug.trim().toLowerCase()
    if (!key) return null
    return Object.values(this.store.organizations).find((o) => o.slug === key) || null
  }

  uniqueSlug(fromName: string): string {
    let slug = slugifyStoreName(fromName)
    if (isReservedSlug(slug) || this.findOrgBySlug(slug)) {
      slug = `${slug}-${randomBytes(2).toString('hex')}`
    }
    let n = 2
    while (this.findOrgBySlug(slug) || isReservedSlug(slug)) {
      slug = `${slugifyStoreName(fromName)}-${n}`
      n += 1
    }
    return slug
  }

  findUserForLogin(username: string, storeSlug?: string): CloudUser | CloudUser[] | null {
    const key = username.toLowerCase()
    if (storeSlug) {
      const org = this.findOrgBySlug(storeSlug)
      if (!org) return null
      return (
        Object.values(this.store.users).find(
          (u) =>
            u.organizationId === org.id && u.username.toLowerCase() === key && u.active,
        ) || null
      )
    }
    const matches = this.findUsersByUsername(username)
    if (matches.length === 0) return null
    if (matches.length === 1) return matches[0]
    return matches
  }

  toSession(user: CloudUser): CloudSession {
    const org = this.store.organizations[user.organizationId]
    return {
      userId: user.id,
      username: user.username,
      nome: user.nome,
      role: user.role,
      organizationId: user.organizationId,
      organizationName: org?.name,
      organizationSlug: org?.slug,
    }
  }

  resolveToken(token: string): CloudSession | null {
    const entry = this.store.tokens[token]
    if (!entry) return null
    const user = this.store.users[entry.userId]
    if (!user || !user.active) return null
    return this.toSession(user)
  }
}

export async function getStore(): Promise<JsonStore> {
  return JsonStore.open()
}
