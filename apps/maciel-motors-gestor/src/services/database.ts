import type { Database, Settings, User } from '@/types'
import { generateId, nowISO } from '@/utils'
import { seedDatabase } from '@/data/seed'
import { storageSuffix } from '@/config/variant'

/** v4: empty start + admin password MacielMotors123. Bumped to refresh stored users. */
const DB_KEY = `maciel_motors_gestor_db_v4${storageSuffix}`
const SESSION_KEY = `maciel_motors_gestor_session${storageSuffix}`
const REMEMBER_KEY = `maciel_motors_gestor_remember${storageSuffix}`
const LEGACY_DB_KEYS = storageSuffix
  ? []
  : [
      'maciel_motors_gestor_db_v3',
      'maciel_motors_gestor_db_v2',
      'maciel_motors_gestor_db',
    ]

function createDefaultSettings(): Settings {
  return {
    id: 'settings_default',
    nomeEmpresa: 'Maciel Motors Gestor',
    logo: '',
    telefone: '(11) 99999-0000',
    whatsapp: '(11) 99999-0000',
    instagram: '@macielmotors',
    email: 'contato@macielmotors.com.br',
    endereco: 'Av. Automotiva, 1000',
    cidade: 'São Paulo - SP',
    tema: 'dark',
    modoEscuro: true,
    updatedAt: nowISO(),
  }
}

function createDefaultUsers(): User[] {
  return [
    {
      id: 'user_admin',
      username: 'admin',
      password: 'MacielMotors123',
      nome: 'Administrador',
      role: 'admin',
      active: true,
      createdAt: nowISO(),
    },
    {
      id: 'user_maciel',
      username: 'maciel',
      password: 'maciel123',
      nome: 'Maciel Motors',
      role: 'admin',
      active: true,
      createdAt: nowISO(),
    },
  ]
}

export function createEmptyDatabase(): Database {
  return {
    vehicles: [],
    sales: [],
    expenses: [],
    customers: [],
    users: createDefaultUsers(),
    settings: [createDefaultSettings()],
    history: [],
  }
}

function purgeLegacyDatabases(): void {
  for (const key of LEGACY_DB_KEYS) {
    localStorage.removeItem(key)
  }
}

export function loadDatabase(): Database {
  try {
    purgeLegacyDatabases()
    const raw = localStorage.getItem(DB_KEY)
    if (!raw) {
      const empty = createEmptyDatabase()
      saveDatabase(empty)
      return empty
    }
    const parsed = JSON.parse(raw) as Database
    return {
      vehicles: parsed.vehicles || [],
      sales: parsed.sales || [],
      expenses: parsed.expenses || [],
      customers: parsed.customers || [],
      users: parsed.users?.length ? parsed.users : createDefaultUsers(),
      settings: parsed.settings?.length ? parsed.settings : [createDefaultSettings()],
      history: parsed.history || [],
    }
  } catch {
    const empty = createEmptyDatabase()
    saveDatabase(empty)
    return empty
  }
}

export function saveDatabase(db: Database): void {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(db))
  } catch (e) {
    const isQuota =
      e instanceof DOMException &&
      (e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        e.code === 22 ||
        e.code === 1014)
    if (isQuota) {
      throw new Error(
        'Espaço insuficiente para salvar. Remova algumas fotos ou use imagens menores e tente de novo.',
      )
    }
    throw e instanceof Error ? e : new Error('Falha ao salvar os dados')
  }
}

export function resetDatabase(): Database {
  const db = seedDatabase()
  saveDatabase(db)
  return db
}

export function clearDatabase(): Database {
  const db = createEmptyDatabase()
  saveDatabase(db)
  return db
}

export function exportDatabase(): Database {
  return loadDatabase()
}

export function importDatabase(data: unknown): Database {
  if (!data || typeof data !== 'object') {
    throw new Error('Arquivo de backup inválido')
  }
  const incoming = data as Partial<Database>
  const db: Database = {
    vehicles: Array.isArray(incoming.vehicles) ? incoming.vehicles : [],
    sales: Array.isArray(incoming.sales) ? incoming.sales : [],
    expenses: Array.isArray(incoming.expenses) ? incoming.expenses : [],
    customers: Array.isArray(incoming.customers) ? incoming.customers : [],
    users: Array.isArray(incoming.users) && incoming.users.length
      ? incoming.users
      : createDefaultUsers(),
    settings: Array.isArray(incoming.settings) && incoming.settings.length
      ? incoming.settings
      : [createDefaultSettings()],
    history: Array.isArray(incoming.history) ? incoming.history : [],
  }
  saveDatabase(db)
  return db
}

export function getSession(): { userId: string; username: string; nome: string } | null {
  const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setSession(
  session: { userId: string; username: string; nome: string },
  remember: boolean,
): void {
  const raw = JSON.stringify(session)
  if (remember) {
    localStorage.setItem(SESSION_KEY, raw)
    localStorage.setItem(REMEMBER_KEY, '1')
    sessionStorage.removeItem(SESSION_KEY)
  } else {
    sessionStorage.setItem(SESSION_KEY, raw)
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(REMEMBER_KEY)
  }
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY)
  sessionStorage.removeItem(SESSION_KEY)
}

export function updateCollection<T extends { id: string }>(
  items: T[],
  id: string,
  patch: Partial<T>,
): T[] {
  return items.map((item) => (item.id === id ? { ...item, ...patch } : item))
}

export function removeFromCollection<T extends { id: string }>(items: T[], id: string): T[] {
  return items.filter((item) => item.id !== id)
}

export { generateId, DB_KEY }
