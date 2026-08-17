import type { Database } from '@/types'
import {
  getCloudToken,
  getSyncVersion,
  loadDatabase,
  markSynced,
  saveDatabase,
  setCloudToken,
  type SessionUser,
} from '@/services/database'

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'device-only' | 'offline' | 'error'

export type CloudHealth = {
  ok: boolean
  blob: boolean
  plateApi: boolean
  fipe: boolean
}

const API_BASE = '/api/lp-motors'

async function api<T>(
  path: string,
  options: RequestInit = {},
): Promise<{ ok: boolean; status: number; data: T }> {
  const token = getCloudToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
    const data = (await res.json().catch(() => ({}))) as T
    return { ok: res.ok, status: res.status, data }
  } catch {
    return { ok: false, status: 0, data: {} as T }
  }
}

export const cloudSync = {
  async health(): Promise<CloudHealth> {
    const res = await api<{
      ok?: boolean
      blob?: boolean
      plateApi?: boolean
      fipe?: boolean
    }>('/health')
    return {
      ok: res.ok && Boolean(res.data.ok),
      blob: Boolean(res.data.blob),
      plateApi: Boolean(res.data.plateApi),
      fipe: Boolean(res.data.fipe),
    }
  },

  async login(
    username: string,
    password: string,
    store?: string,
  ): Promise<{ session: SessionUser; database: Database } | null> {
    const res = await api<{
      token?: string
      session?: SessionUser
      database?: Database
      error?: string
      stores?: { slug: string; name: string }[]
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password, store: store || undefined }),
    })
    if (res.status === 409) {
      const names = (res.data.stores || []).map((s) => s.slug).join(', ')
      throw new Error(
        res.data.error || `Várias lojas usam este login. Informe o código (${names}).`,
      )
    }
    if (res.status === 401) {
      throw new Error(res.data.error || 'Usuário, senha ou loja inválidos.')
    }
    if (!res.ok || !res.data.token || !res.data.session || !res.data.database) return null
    setCloudToken(res.data.token)
    saveDatabase(res.data.database)
    markSynced(getSyncVersion())
    return { session: res.data.session, database: res.data.database }
  },

  async register(input: {
    storeName: string
    ownerName: string
    username: string
    password: string
    city?: string
    phone?: string
  }): Promise<{ session: SessionUser; database: Database; slug: string }> {
    const res = await api<{
      token?: string
      session?: SessionUser
      database?: Database
      slug?: string
      error?: string
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    if (!res.ok || !res.data.token || !res.data.session || !res.data.database) {
      throw new Error(res.data.error || 'Não foi possível cadastrar a loja.')
    }
    setCloudToken(res.data.token)
    saveDatabase(res.data.database)
    markSynced(res.data.session ? 1 : getSyncVersion())
    return {
      session: res.data.session,
      database: res.data.database,
      slug: res.data.slug || res.data.session.organizationSlug || '',
    }
  },

  async pull(): Promise<Database | null> {
    const res = await api<{ database?: Database; version?: number }>('/db')
    if (!res.ok || !res.data.database) return null
    saveDatabase(res.data.database)
    markSynced(res.data.version || getSyncVersion())
    return res.data.database
  },

  async push(db?: Database): Promise<{ ok: boolean; message?: string }> {
    const payload = db || loadDatabase()
    const res = await api<{ version?: number; error?: string }>('/db', {
      method: 'PUT',
      body: JSON.stringify({ database: payload, clientVersion: getSyncVersion() }),
    })
    if (!res.ok) {
      return { ok: false, message: (res.data as { error?: string }).error || 'Falha ao sincronizar' }
    }
    markSynced(res.data.version || getSyncVersion() + 1)
    return { ok: true }
  },

  async bootstrapLocal(username: string, password: string, session: SessionUser): Promise<void> {
    // Register/sync local org to cloud when API is available
    const db = loadDatabase()
    const res = await api<{ token?: string; error?: string }>('/auth/bootstrap', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
        session,
        database: db,
      }),
    })
    if (res.ok && res.data.token) {
      setCloudToken(res.data.token)
      markSynced(getSyncVersion())
    }
  },
}
