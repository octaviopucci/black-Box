import type {
  AuditLog,
  Database,
  HistoryEvent,
  HistoryEventType,
  User,
  UserRole,
} from '@/types'
import {
  clearSession,
  getSession,
  loadDatabase,
  saveDatabase,
  setSession,
  type SessionUser,
} from '@/services/database'
import { generateId, nowISO } from '@/utils'
import { roleCan } from '@/utils/constants'
import { cloudSync } from '@/services/sync'

export interface AuthResult {
  success: boolean
  message: string
  user?: SessionUser
}

export const authService = {
  async login(
    username: string,
    password: string,
    remember: boolean,
    store?: string,
  ): Promise<AuthResult> {
    try {
      const cloud = await cloudSync.login(username, password, store)
      if (cloud) {
        setSession(cloud.session, remember)
        return { success: true, message: 'Login sincronizado na nuvem', user: cloud.session }
      }
    } catch (e) {
      return {
        success: false,
        message: e instanceof Error ? e.message : 'Falha no login',
      }
    }

    const db = loadDatabase()
    const user = db.users.find(
      (u) =>
        u.username.toLowerCase() === username.trim().toLowerCase() &&
        u.password === password &&
        u.active,
    )
    if (!user) {
      return { success: false, message: 'Usuário ou senha inválidos' }
    }
    const session: SessionUser = {
      userId: user.id,
      username: user.username,
      nome: user.nome,
      role: user.role,
      organizationId: user.organizationId || db.organization?.id || 'org_lp_default',
      organizationName: db.organization?.name,
      organizationSlug: db.organization?.slug,
    }
    setSession(session, remember)
    void cloudSync.bootstrapLocal(username, password, session)
    return { success: true, message: 'Login realizado com sucesso', user: session }
  },

  async register(input: {
    storeName: string
    ownerName: string
    username: string
    password: string
    city?: string
    phone?: string
    remember?: boolean
  }): Promise<AuthResult & { slug?: string }> {
    try {
      const cloud = await cloudSync.register(input)
      setSession(cloud.session, input.remember !== false)
      return {
        success: true,
        message: `Loja criada. Código: ${cloud.slug}`,
        user: cloud.session,
        slug: cloud.slug,
      }
    } catch (e) {
      return {
        success: false,
        message: e instanceof Error ? e.message : 'Falha no cadastro',
      }
    }
  },

  logout(): void {
    clearSession()
  },

  getCurrentUser() {
    return getSession()
  },

  isAuthenticated(): boolean {
    return !!getSession()
  },

  listUsers(): User[] {
    return loadDatabase().users
  },

  can(permission: string): boolean {
    const session = getSession()
    if (!session) return false
    return roleCan(session.role, permission)
  },

  createUser(input: {
    username: string
    password: string
    nome: string
    role: UserRole
  }): User {
    if (!this.can('*') && !this.can('users')) {
      throw new Error('Sem permissão para gerenciar usuários.')
    }
    const db = loadDatabase()
    if (db.users.some((u) => u.username.toLowerCase() === input.username.toLowerCase())) {
      throw new Error('Já existe um usuário com este login.')
    }
    const user: User = {
      id: generateId('user'),
      organizationId: db.organization?.id,
      username: input.username.trim(),
      password: input.password,
      nome: input.nome.trim(),
      role: input.role,
      active: true,
      createdAt: nowISO(),
    }
    db.users.push(user)
    auditService.log(db, 'user.create', 'user', user.id, `Usuário ${user.username} criado`)
    persist(db)
    return user
  },

  updateUser(id: string, patch: Partial<Pick<User, 'nome' | 'password' | 'role' | 'active'>>): User {
    if (!this.can('*') && !this.can('users')) {
      throw new Error('Sem permissão para gerenciar usuários.')
    }
    const db = loadDatabase()
    const idx = db.users.findIndex((u) => u.id === id)
    if (idx < 0) throw new Error('Usuário não encontrado')
    db.users[idx] = { ...db.users[idx], ...patch }
    auditService.log(db, 'user.update', 'user', id, `Usuário ${db.users[idx].username} atualizado`)
    persist(db)
    return db.users[idx]
  },
}

export const historyService = {
  add(
    db: Database,
    input: {
      vehicleId?: string
      type: HistoryEventType
      descricao: string
      usuario?: string
    },
  ): HistoryEvent {
    const now = new Date()
    const event: HistoryEvent = {
      id: generateId('hist'),
      organizationId: db.organization?.id,
      vehicleId: input.vehicleId,
      type: input.type,
      data: now.toISOString().slice(0, 10),
      hora: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      descricao: input.descricao,
      usuario: input.usuario || getSession()?.nome || 'Sistema',
      createdAt: nowISO(),
    }
    db.history.unshift(event)
    return event
  },

  listByVehicle(vehicleId: string): HistoryEvent[] {
    return loadDatabase()
      .history.filter((h) => h.vehicleId === vehicleId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  listRecent(limit = 10): HistoryEvent[] {
    return loadDatabase()
      .history.slice()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit)
  },
}

export const auditService = {
  log(
    db: Database,
    action: string,
    entityType: string,
    entityId: string,
    detail: string,
  ): AuditLog {
    const session = getSession()
    const entry: AuditLog = {
      id: generateId('aud'),
      organizationId: db.organization?.id,
      userId: session?.userId || 'system',
      username: session?.username || 'sistema',
      action,
      entityType,
      entityId,
      detail,
      createdAt: nowISO(),
    }
    db.auditLogs.unshift(entry)
    if (db.auditLogs.length > 2000) db.auditLogs.length = 2000
    return entry
  },

  list(limit = 100): AuditLog[] {
    return loadDatabase().auditLogs.slice(0, limit)
  },
}

export function persist(db: Database): Database {
  saveDatabase(db)
  cloudSync.schedulePush(db)
  return db
}
