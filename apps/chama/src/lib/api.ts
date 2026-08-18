const WORKSPACE_KEY = 'chama-workspace-id'

export function getWorkspaceId() {
  let id = localStorage.getItem(WORKSPACE_KEY)
  if (!id) {
    id = `ws_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`
    localStorage.setItem(WORKSPACE_KEY, id)
  }
  return id
}

function apiBase() {
  // Same-origin on production: /api/chama
  // Local vite can proxy or hit production API
  const env = import.meta.env.VITE_CHAMA_API_BASE as string | undefined
  return (env || '/api/chama').replace(/\/$/, '')
}

async function chamaFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const headers = new Headers(init.headers || {})
  headers.set('X-Chama-Workspace', getWorkspaceId())
  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }
  const res = await fetch(`${apiBase()}${path}`, { ...init, headers })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.message || data?.error || `HTTP ${res.status}`)
  }
  return data as T
}

export interface ChamaConfig {
  metaConfigured: boolean
  appId: string | null
  oauthCallback: string
  webhookUrl: string
  publicBaseUrl: string
  setup: {
    redirectUri: string
    webhookUrl: string
    scopes: string[]
  }
}

export interface ChamaConnection {
  connected: boolean
  metaConfigured: boolean
  igUsername?: string
  igUserId?: string
  pageName?: string
  pageId?: string
  connectedAt?: string
  webhookSubscribed?: boolean
}

export function fetchChamaConfig() {
  return chamaFetch<ChamaConfig>('/config')
}

export function fetchConnection() {
  return chamaFetch<ChamaConnection>('/connection')
}

export function disconnectInstagram() {
  return chamaFetch<{ ok: boolean }>('/connection', { method: 'DELETE' })
}

export function oauthStartUrl() {
  return `${apiBase()}/oauth/start?workspace=${encodeURIComponent(getWorkspaceId())}`
}

export function syncAutomations(
  items: Array<{
    id: string
    name: string
    trigger: string
    active: boolean
    matches: number
    replyText?: string
  }>,
) {
  return chamaFetch<{ ok: boolean; count: number }>('/automations/sync', {
    method: 'POST',
    body: JSON.stringify({ items }),
  })
}

export function fetchReplyLogs() {
  return chamaFetch<{ items: Array<Record<string, unknown>> }>('/logs')
}
