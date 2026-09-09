import type { OrgDatabase } from '@/types'
import {
  getCloudToken,
  getSyncVersion,
  loadDatabase,
  markSynced,
  saveDatabase,
  setCloudToken,
  type SessionUser,
} from './database'

const API_BASE = '/api/iphone-imports'

async function api<T>(path: string, options: RequestInit = {}): Promise<{ ok: boolean; status: number; data: T }> {
  const token = getCloudToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
  const data = (await res.json().catch(() => ({}))) as T
  return { ok: res.ok, status: res.status, data }
}

const STORE_SLUG_FALLBACKS = ['iphone-imports']

type LoginResponse = {
  token?: string
  session?: SessionUser
  database?: OrgDatabase
  error?: string
  stores?: { slug: string; name: string }[]
}

async function attemptLogin(username: string, password: string, storeSlug?: string) {
  return api<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password, store: storeSlug }),
  })
}

export const cloudSync = {
  async login(username: string, password: string, store?: string) {
    const slugCandidates = [...new Set([store, ...STORE_SLUG_FALLBACKS].filter(Boolean))] as string[]

    let lastError = 'Login inválido.'
    for (const slug of slugCandidates) {
      const res = await attemptLogin(username, password, slug)
      if (res.ok && res.data.token && res.data.database) {
        setCloudToken(res.data.token)
        saveDatabase(res.data.database)
        markSynced(res.data.database.version)
        return res.data
      }
      lastError = res.data.error || lastError
    }

    const ambiguous = await attemptLogin(username, password)
    if (ambiguous.status === 409 && ambiguous.data.stores?.length) {
      for (const option of ambiguous.data.stores) {
        const res = await attemptLogin(username, password, option.slug)
        if (res.ok && res.data.token && res.data.database) {
          setCloudToken(res.data.token)
          saveDatabase(res.data.database)
          markSynced(res.data.database.version)
          return res.data
        }
      }
    }

    throw new Error(lastError)
  },

  async register(input: {
    storeName: string
    ownerName: string
    username: string
    password: string
    city?: string
    phone?: string
  }) {
    const res = await api<{
      token?: string
      session?: SessionUser
      database?: OrgDatabase
      slug?: string
      error?: string
    }>('/auth/register', { method: 'POST', body: JSON.stringify(input) })
    if (!res.ok || !res.data.token || !res.data.database) {
      throw new Error(res.data.error || 'Falha no cadastro.')
    }
    setCloudToken(res.data.token)
    saveDatabase(res.data.database)
    markSynced(1)
    return res.data
  },

  async push(db?: OrgDatabase) {
    const payload = db || loadDatabase()
    if (!payload) return { ok: false, message: 'Sem dados locais.' }
    const res = await api<{ version?: number; error?: string }>('/db', {
      method: 'PUT',
      body: JSON.stringify({ database: payload, clientVersion: getSyncVersion() }),
    })
    if (!res.ok) return { ok: false, message: res.data.error || 'Falha ao sincronizar' }
    markSynced(res.data.version || getSyncVersion() + 1)
    return { ok: true }
  },

  async pull() {
    const res = await api<{ database?: OrgDatabase; version?: number }>('/db')
    if (!res.ok || !res.data.database) return null
    saveDatabase(res.data.database)
    markSynced(res.data.version || getSyncVersion())
    return res.data.database
  },

  schedulePush(db?: OrgDatabase) {
    if (!getCloudToken()) return
    setTimeout(() => void cloudSync.push(db), 500)
  },
}

export function persist(db: OrgDatabase): OrgDatabase {
  saveDatabase(db)
  cloudSync.schedulePush(db)
  return db
}
