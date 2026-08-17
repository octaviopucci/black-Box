import type { Database } from '@/types'
import {
  getCloudToken,
  getSyncVersion,
  isDirty,
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
const AUTO_SYNC_MS = 30_000
const PUSH_DEBOUNCE_MS = 600

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

let syncInFlight = false
let syncQueued = false
let pushTimer: ReturnType<typeof setTimeout> | null = null
let pendingPushDb: Database | undefined

export const cloudSync = {
  autoSyncIntervalMs: AUTO_SYNC_MS,

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

  /** Envia alterações locais para a nuvem (debounced após cada save). */
  schedulePush(db?: Database): void {
    if (!getCloudToken()) return
    pendingPushDb = db
    if (pushTimer) clearTimeout(pushTimer)
    pushTimer = setTimeout(() => {
      pushTimer = null
      void cloudSync.flushPush()
    }, PUSH_DEBOUNCE_MS)
  },

  async flushPush(): Promise<void> {
    if (!getCloudToken() || !isDirty()) return
    await cloudSync.push(pendingPushDb)
    pendingPushDb = undefined
  },

  /**
   * Sincronização automática silenciosa:
   * - com alterações locais pendentes: envia primeiro, depois baixa
   * - sem alterações: só baixa da nuvem (outros dispositivos)
   */
  async autoSync(): Promise<{ status: SyncStatus; health: CloudHealth | null }> {
    if (syncInFlight) {
      syncQueued = true
      return { status: 'syncing', health: null }
    }
    if (!getCloudToken()) {
      return { status: 'idle', health: null }
    }

    syncInFlight = true
    try {
      const health = await cloudSync.health()
      if (!health.ok) return { status: 'offline', health }
      if (!health.blob) return { status: 'device-only', health }

      if (pushTimer) {
        clearTimeout(pushTimer)
        pushTimer = null
        await cloudSync.flushPush()
      } else if (isDirty()) {
        const pushed = await cloudSync.push()
        if (!pushed.ok) return { status: 'error', health }
      }

      await cloudSync.pull()
      return { status: 'synced', health }
    } catch {
      return { status: 'error', health: null }
    } finally {
      syncInFlight = false
      if (syncQueued) {
        syncQueued = false
        void cloudSync.autoSync()
      }
    }
  },

  async bootstrapLocal(username: string, password: string, session: SessionUser): Promise<void> {
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
