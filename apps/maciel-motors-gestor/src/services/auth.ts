import type { Database, HistoryEvent, HistoryEventType, User } from '@/types'
import {
  clearSession,
  getSession,
  loadDatabase,
  saveDatabase,
  setSession,
} from '@/services/database'
import { generateId, nowISO } from '@/utils'

export interface AuthResult {
  success: boolean
  message: string
  user?: { userId: string; username: string; nome: string }
}

export const authService = {
  login(username: string, password: string, remember: boolean): AuthResult {
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
    const session = { userId: user.id, username: user.username, nome: user.nome }
    setSession(session, remember)
    return { success: true, message: 'Login realizado com sucesso', user: session }
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

export function persist(db: Database): Database {
  saveDatabase(db)
  return db
}
