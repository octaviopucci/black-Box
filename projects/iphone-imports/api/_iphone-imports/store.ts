import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { list, put } from '@vercel/blob'

const BLOB_PATHNAME = 'iphone-imports/store.json'
const FILE_PATH =
  process.env.VERCEL || process.env.VERCEL_ENV
    ? '/tmp/iphone-imports-store.json'
    : './data/iphone-imports-store.json'

export interface BlobDiagnostics {
  configured: boolean
  hasToken: boolean
  hasStoreId: boolean
  hasOidc: boolean
  hasOidcHeader: boolean
  onVercel: boolean
  vercelProjectId?: string
  vercelEnv?: string
  blobEnvKeys: string[]
}

export interface PersistResult {
  disk: boolean
  blob: boolean
  blobError?: string
}

let runtimeOidcToken: string | undefined

export function setRuntimeOidcToken(token: string | undefined): void {
  runtimeOidcToken = token?.trim() || undefined
}

function blobReadWriteToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN || process.env.IPHONE_IMPORTS_BLOB_READ_WRITE_TOKEN
}

function blobStoreId(): string | undefined {
  return process.env.BLOB_STORE_ID || process.env.IPHONE_IMPORTS_BLOB_STORE_ID
}

export function blobAuthOptions(): {
  token?: string
  storeId?: string
  oidcToken?: string
} {
  const token = blobReadWriteToken()
  if (token) return { token }

  const storeId = blobStoreId()
  const oidcToken = runtimeOidcToken || process.env.VERCEL_OIDC_TOKEN
  if (oidcToken && storeId) return { oidcToken, storeId }
  if (storeId) return { storeId }
  if (oidcToken) return { oidcToken }
  return {}
}

/** Blob ativo via token clássico OU OIDC moderno (BLOB_STORE_ID na Vercel). */
export function blobConfigured(): boolean {
  if (blobReadWriteToken()) return true
  if (blobStoreId()) return true
  return Boolean(runtimeOidcToken || process.env.VERCEL_OIDC_TOKEN)
}

export function blobDiagnostics(hasOidcHeader = false): BlobDiagnostics {
  const blobEnvKeys = Object.keys(process.env).filter(
    (k) => k.includes('BLOB') || k.includes('OIDC'),
  )
  return {
    configured: blobConfigured(),
    hasToken: Boolean(blobReadWriteToken()),
    hasStoreId: Boolean(blobStoreId()),
    hasOidc: Boolean(runtimeOidcToken || process.env.VERCEL_OIDC_TOKEN),
    hasOidcHeader,
    onVercel: Boolean(process.env.VERCEL),
    vercelProjectId: process.env.VERCEL_PROJECT_ID,
    vercelEnv: process.env.VERCEL_ENV,
    blobEnvKeys,
  }
}

export async function probeBlobStorage(): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.VERCEL) return { ok: false, error: 'local' }
  try {
    await list({ prefix: BLOB_PATHNAME, limit: 1, ...blobAuthOptions() })
    return { ok: true }
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'blob unreachable',
    }
  }
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

export interface IphoneImportsStore {
  organizations: Record<string, CloudOrg>
  users: Record<string, CloudUser>
  databases: Record<string, OrgDatabaseRecord>
  tokens: Record<string, { organizationId: string; userId: string; createdAt: string }>
}

function emptyStore(): IphoneImportsStore {
  return {
    organizations: {},
    users: {},
    databases: {},
    tokens: {},
  }
}

export function hashPassword(password: string): string {
  return createHash('sha256').update(`iphone-imports:${password}`).digest('hex')
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
  'iphone-imports',
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
  private store: IphoneImportsStore
  private dirty = false

  private constructor(store: IphoneImportsStore) {
    this.store = store
  }

  static async open(): Promise<JsonStore> {
    if (cached) return cached
    mkdirSync(dirname(FILE_PATH), { recursive: true })
    let store = emptyStore()
    let hydratedFromBlob = false

    if (blobConfigured() || process.env.VERCEL) {
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
            store = { ...emptyStore(), ...((await res.json()) as Partial<IphoneImportsStore>) }
            hydratedFromBlob = true
            try {
              writeFileSync(FILE_PATH, JSON.stringify(store))
            } catch {
              /* cache best-effort */
            }
          }
        }
      } catch (err) {
        console.warn('[iphone-imports] blob hydrate failed', err)
      }
    }

    if (!hydratedFromBlob && existsSync(FILE_PATH)) {
      try {
        const parsed = JSON.parse(readFileSync(FILE_PATH, 'utf8')) as Partial<IphoneImportsStore>
        store = { ...emptyStore(), ...parsed }
      } catch {
        /* keep */
      }
    }

    cached = new JsonStore(store)
    return cached
  }

  /** Reset cache for tests. */
  static resetCache(): void {
    cached = null
  }

  data(): IphoneImportsStore {
    return this.store
  }

  markDirty(): void {
    this.dirty = true
  }

  async persist(): Promise<PersistResult> {
    if (!this.dirty) return { disk: true, blob: false }
    writeFileSync(FILE_PATH, JSON.stringify(this.store))
    let blobOk = false
    let blobError: string | undefined
    if (blobConfigured() || process.env.VERCEL) {
      try {
        await put(BLOB_PATHNAME, JSON.stringify(this.store), {
          access: 'public',
          addRandomSuffix: false,
          allowOverwrite: true,
          contentType: 'application/json',
          ...blobAuthOptions(),
        })
        blobOk = true
      } catch (err) {
        blobError = err instanceof Error ? err.message : 'blob persist failed'
        console.warn('[iphone-imports] blob persist failed', err)
      }
    }
    this.dirty = false
    return { disk: true, blob: blobOk, blobError }
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
  if (process.env.VERCEL) {
    JsonStore.resetCache()
  }
  return JsonStore.open()
}
