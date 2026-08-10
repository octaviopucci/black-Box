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

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error'

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
  async health(): Promise<boolean> {
    const res = await api<{ ok?: boolean }>('/health')
    return res.ok && Boolean((res.data as { ok?: boolean }).ok)
  },

  async login(
    username: string,
    password: string,
  ): Promise<{ session: SessionUser; database: Database } | null> {
    const res = await api<{
      token?: string
      session?: SessionUser
      database?: Database
      error?: string
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok || !res.data.token || !res.data.session || !res.data.database) return null
    setCloudToken(res.data.token)
    saveDatabase(res.data.database)
    markSynced(getSyncVersion())
    return { session: res.data.session, database: res.data.database }
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
