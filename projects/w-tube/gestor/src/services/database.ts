import type { OrgDatabase } from '@/types'

const DB_KEY = 'w_tube_gestor_db'
const SESSION_KEY = 'w_tube_gestor_session'
const TOKEN_KEY = 'w_tube_gestor_token'
const SYNC_KEY = 'w_tube_gestor_sync'

export type SessionUser = {
  userId: string
  username: string
  nome: string
  role: string
  organizationId: string
  organizationName?: string
  organizationSlug?: string
}

export function loadDatabase(): OrgDatabase | null {
  try {
    const raw = localStorage.getItem(DB_KEY)
    return raw ? (JSON.parse(raw) as OrgDatabase) : null
  } catch {
    return null
  }
}

export function saveDatabase(db: OrgDatabase): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
  const meta = getSyncMeta()
  localStorage.setItem(SYNC_KEY, JSON.stringify({ ...meta, dirty: true, version: db.version }))
}

export function getSession(): SessionUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? (JSON.parse(raw) as SessionUser) : null
  } catch {
    return null
  }
}

export function setSession(session: SessionUser, remember = true): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  if (remember) localStorage.setItem(`${SESSION_KEY}_remember`, '1')
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(SYNC_KEY)
}

export function getCloudToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setCloudToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getSyncMeta(): { version: number; dirty: boolean } {
  try {
    const raw = localStorage.getItem(SYNC_KEY)
    return raw ? JSON.parse(raw) : { version: 0, dirty: false }
  } catch {
    return { version: 0, dirty: false }
  }
}

export function markSynced(version: number): void {
  localStorage.setItem(SYNC_KEY, JSON.stringify({ version, dirty: false }))
}

export function isDirty(): boolean {
  return getSyncMeta().dirty
}

export function getSyncVersion(): number {
  return getSyncMeta().version
}
