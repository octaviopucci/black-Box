import type {
  Database,
  Organization,
  Settings,
  User,
  Vehicle,
  VehicleDocument,
  VehicleChecklist,
  Expense,
} from '@/types'
import { generateId, nowISO } from '@/utils'
import { seedDatabase } from '@/data/seed'
import { storageSuffix, APP_NAME } from '@/config/variant'
import { defaultOrgSettings, normalizeStatus } from '@/utils/finance'
import { DEFAULT_CHECKLIST } from '@/utils/constants'

const DB_VERSION = 5
const DB_KEY = `lp_motors_gestor_db_v5${storageSuffix}`
const SESSION_KEY = `lp_motors_gestor_session${storageSuffix}`
const REMEMBER_KEY = `lp_motors_gestor_remember${storageSuffix}`
const ORG_TOKEN_KEY = `lp_motors_gestor_token${storageSuffix}`
const SYNC_META_KEY = `lp_motors_gestor_sync${storageSuffix}`

const LEGACY_DB_KEYS = [
  `maciel_motors_gestor_db_v4${storageSuffix}`,
  ...(storageSuffix
    ? []
    : [
        'maciel_motors_gestor_db_v3',
        'maciel_motors_gestor_db_v2',
        'maciel_motors_gestor_db',
        'lp_motors_gestor_db_v4',
      ]),
]

export type SessionUser = {
  userId: string
  username: string
  nome: string
  role: User['role']
  organizationId: string
}

function createDefaultOrg(): Organization {
  return {
    id: 'org_lp_default',
    name: APP_NAME,
    slug: 'lp-motors',
    createdAt: nowISO(),
  }
}

function createDefaultSettings(orgId: string): Settings {
  return {
    id: 'settings_default',
    organizationId: orgId,
    nomeEmpresa: APP_NAME,
    logo: '',
    telefone: '(11) 4000-0000',
    whatsapp: '(11) 90000-0000',
    instagram: '@lpmotors',
    email: 'contato@lpmotors.com.br',
    endereco: 'Av. das Concessionárias, 100',
    cidade: 'São Paulo - SP',
    tema: 'light',
    modoEscuro: false,
    org: defaultOrgSettings(),
    updatedAt: nowISO(),
  }
}

function createDefaultUsers(orgId: string): User[] {
  return [
    {
      id: 'user_admin',
      organizationId: orgId,
      username: 'admin',
      password: 'LPMotors123',
      nome: 'Administrador',
      role: 'admin',
      active: true,
      createdAt: nowISO(),
    },
    {
      id: 'user_gerente',
      organizationId: orgId,
      username: 'gerente',
      password: 'gerente123',
      nome: 'Gerente LP',
      role: 'gerente',
      active: true,
      createdAt: nowISO(),
    },
  ]
}

export function createEmptyDatabase(): Database {
  const org = createDefaultOrg()
  return {
    version: DB_VERSION,
    organization: org,
    vehicles: [],
    sales: [],
    expenses: [],
    customers: [],
    users: createDefaultUsers(org.id),
    settings: [createDefaultSettings(org.id)],
    history: [],
    documents: [],
    checklists: [],
    priceHistory: [],
    statusHistory: [],
    suppliers: [],
    payables: [],
    auditLogs: [],
  }
}

function migrateVehicle(v: Partial<Vehicle> & { id: string }): Vehicle {
  const status = normalizeStatus((v.status as Vehicle['status']) || 'comprado')
  return {
    id: v.id,
    organizationId: v.organizationId,
    codigoInterno: v.codigoInterno || `LP-${v.id.slice(-6).toUpperCase()}`,
    marca: v.marca || '',
    modelo: v.modelo || '',
    versao: v.versao || '',
    ano: v.ano || new Date().getFullYear(),
    anoModelo: v.anoModelo || v.ano || new Date().getFullYear(),
    categoria: v.categoria || '',
    cor: v.cor || '',
    placa: v.placa || '',
    renavam: v.renavam || '',
    chassi: v.chassi || '',
    motor: v.motor || '',
    portas: v.portas ?? 4,
    combustivel: v.combustivel || 'flex',
    cambio: v.cambio || 'manual',
    quilometragem: v.quilometragem || 0,
    cidade: v.cidade || '',
    estado: v.estado || 'SP',
    fornecedor: v.fornecedor || '',
    telefoneFornecedor: v.telefoneFornecedor || '',
    origem: v.origem || '',
    cpfCnpjOrigem: v.cpfCnpjOrigem || '',
    localCompra: v.localCompra || '',
    formaPagamentoCompra: v.formaPagamentoCompra || '',
    entradaCompra: v.entradaCompra || 0,
    financiamentoCompra: v.financiamentoCompra || 0,
    observacoesCompra: v.observacoesCompra || '',
    precoFipe: v.precoFipe || 0,
    valorCompra: v.valorCompra || 0,
    precoAnunciado: v.precoAnunciado || 0,
    precoMinimo: v.precoMinimo || 0,
    observacoes: v.observacoes || '',
    dataCompra: v.dataCompra || nowISO().slice(0, 10),
    fotos: Array.isArray(v.fotos) ? v.fotos : [],
    fotoPrincipal: v.fotoPrincipal || 0,
    status,
    consignado: Boolean(v.consignado),
    archived: Boolean(v.archived),
    draft: Boolean(v.draft),
    vendedorResponsavel: v.vendedorResponsavel || '',
    createdAt: v.createdAt || nowISO(),
    updatedAt: v.updatedAt || nowISO(),
  }
}

function migrateExpense(e: Partial<Expense> & { id: string }): Expense {
  return {
    id: e.id,
    organizationId: e.organizationId,
    vehicleId: e.vehicleId || '',
    descricao: e.descricao || '',
    categoria: e.categoria || 'outros',
    valor: e.valor || 0,
    data: e.data || nowISO().slice(0, 10),
    fornecedorId: e.fornecedorId,
    fornecedorNome: e.fornecedorNome || '',
    responsavel: e.responsavel || '',
    formaPagamento: e.formaPagamento || '',
    status: e.status || 'pago',
    documentoUrl: e.documentoUrl || '',
    observacao: e.observacao || '',
    createdAt: e.createdAt || nowISO(),
    updatedAt: e.updatedAt || nowISO(),
  }
}

function normalizeDatabase(raw: Partial<Database>): Database {
  const empty = createEmptyDatabase()
  const org = raw.organization || empty.organization!
  const settingsRaw = Array.isArray(raw.settings) && raw.settings.length ? raw.settings[0] : empty.settings[0]
  const settings: Settings = {
    ...empty.settings[0],
    ...settingsRaw,
    nomeEmpresa: (settingsRaw.nomeEmpresa || '').includes('Maciel')
      ? APP_NAME
      : settingsRaw.nomeEmpresa || APP_NAME,
    org: { ...defaultOrgSettings(), ...(settingsRaw.org || {}) },
    organizationId: org.id,
  }

  const users = (Array.isArray(raw.users) && raw.users.length ? raw.users : empty.users).map((u) => ({
    ...u,
    organizationId: u.organizationId || org.id,
    role: (u.role === 'operador' ? 'operacional' : u.role === 'viewer' ? 'vendedor' : u.role) as User['role'],
    password: u.password?.includes('Maciel') ? 'LPMotors123' : u.password,
    username: u.username === 'maciel' ? 'admin' : u.username,
    nome: u.nome?.includes('Maciel') ? 'Administrador' : u.nome,
  }))

  // dedupe admin if maciel was renamed
  const seen = new Set<string>()
  const uniqueUsers = users.filter((u) => {
    const key = u.username.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  return {
    version: DB_VERSION,
    organization: { ...org, name: org.name.includes('Maciel') ? APP_NAME : org.name },
    vehicles: (raw.vehicles || []).map(migrateVehicle),
    sales: raw.sales || [],
    expenses: (raw.expenses || []).map(migrateExpense),
    customers: raw.customers || [],
    users: uniqueUsers,
    settings: [settings],
    history: raw.history || [],
    documents: (raw.documents || []) as VehicleDocument[],
    checklists: (raw.checklists || []) as VehicleChecklist[],
    priceHistory: raw.priceHistory || [],
    statusHistory: raw.statusHistory || [],
    suppliers: raw.suppliers || [],
    payables: raw.payables || [],
    auditLogs: raw.auditLogs || [],
  }
}

function readLegacy(): Database | null {
  for (const key of LEGACY_DB_KEYS) {
    const raw = localStorage.getItem(key)
    if (!raw) continue
    try {
      const parsed = JSON.parse(raw) as Partial<Database>
      return normalizeDatabase(parsed)
    } catch {
      /* continue */
    }
  }
  return null
}

export function loadDatabase(): Database {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (!raw) {
      const legacy = readLegacy()
      const db = legacy || createEmptyDatabase()
      saveDatabase(db)
      for (const key of LEGACY_DB_KEYS) localStorage.removeItem(key)
      return db
    }
    const parsed = JSON.parse(raw) as Partial<Database>
    return normalizeDatabase(parsed)
  } catch {
    const empty = createEmptyDatabase()
    saveDatabase(empty)
    return empty
  }
}

export function saveDatabase(db: Database): void {
  try {
    const normalized = normalizeDatabase(db)
    localStorage.setItem(DB_KEY, JSON.stringify(normalized))
    const meta = { version: getSyncVersion() + 1, updatedAt: nowISO(), dirty: true }
    localStorage.setItem(SYNC_META_KEY, JSON.stringify(meta))
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

export function getSyncVersion(): number {
  try {
    const raw = localStorage.getItem(SYNC_META_KEY)
    if (!raw) return 0
    return (JSON.parse(raw) as { version?: number }).version || 0
  } catch {
    return 0
  }
}

export function markSynced(version: number): void {
  localStorage.setItem(
    SYNC_META_KEY,
    JSON.stringify({ version, updatedAt: nowISO(), dirty: false }),
  )
}

export function isDirty(): boolean {
  try {
    const raw = localStorage.getItem(SYNC_META_KEY)
    if (!raw) return false
    return Boolean((JSON.parse(raw) as { dirty?: boolean }).dirty)
  } catch {
    return false
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
  const db = normalizeDatabase(data as Partial<Database>)
  saveDatabase(db)
  return db
}

export function getSession(): SessionUser | null {
  const raw = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SessionUser
  } catch {
    return null
  }
}

export function setSession(session: SessionUser, remember: boolean): void {
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
  localStorage.removeItem(ORG_TOKEN_KEY)
}

export function getCloudToken(): string | null {
  return localStorage.getItem(ORG_TOKEN_KEY)
}

export function setCloudToken(token: string): void {
  localStorage.setItem(ORG_TOKEN_KEY, token)
}

export function ensureChecklist(db: Database, vehicleId: string): VehicleChecklist {
  let existing = db.checklists.find((c) => c.vehicleId === vehicleId)
  if (existing) return existing
  existing = {
    id: generateId('chk'),
    organizationId: db.organization?.id,
    vehicleId,
    items: DEFAULT_CHECKLIST.map((item) => ({
      id: generateId('cki'),
      ...item,
      done: false,
    })),
    updatedAt: nowISO(),
  }
  db.checklists.push(existing)
  return existing
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

export { generateId, DB_KEY, DB_VERSION }
