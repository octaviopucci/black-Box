import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  Customer,
  Expense,
  HistoryEvent,
  Sale,
  Settings,
  Vehicle,
  VehicleFilters,
} from '@/types'
import { authService } from '@/services/auth'
import { vehicleService, type VehicleInput } from '@/services/vehicles'
import { expenseService, type ExpenseInput } from '@/services/expenses'
import { customerService, saleService, type CustomerInput, type SaleInput } from '@/services/sales'
import {
  backupService,
  dashboardService,
  reportService,
  settingsService,
} from '@/services'
import { loadDatabase } from '@/services/database'

interface SessionUser {
  userId: string
  username: string
  nome: string
}

interface ToastItem {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface AppContextValue {
  ready: boolean
  user: SessionUser | null
  loading: boolean
  toasts: ToastItem[]
  settings: Settings
  vehicles: Vehicle[]
  expenses: Expense[]
  customers: Customer[]
  sales: Sale[]
  history: HistoryEvent[]
  filters: VehicleFilters
  setFilters: (f: VehicleFilters) => void
  refresh: () => void
  login: (username: string, password: string, remember: boolean) => Promise<void>
  logout: () => void
  toast: (message: string, type?: ToastItem['type']) => void
  dismissToast: (id: string) => void
  withLoading: <T>(fn: () => Promise<T> | T) => Promise<T>
  createVehicle: (input: VehicleInput) => Promise<Vehicle>
  updateVehicle: (id: string, patch: Partial<VehicleInput>) => Promise<Vehicle>
  deleteVehicle: (id: string) => Promise<void>
  duplicateVehicle: (id: string) => Promise<Vehicle>
  archiveVehicle: (id: string) => Promise<void>
  restoreVehicle: (id: string) => Promise<void>
  createExpense: (input: ExpenseInput) => Promise<Expense>
  updateExpense: (id: string, patch: Partial<ExpenseInput>) => Promise<Expense>
  deleteExpense: (id: string) => Promise<void>
  createCustomer: (input: CustomerInput) => Promise<Customer>
  updateCustomer: (id: string, patch: Partial<CustomerInput>) => Promise<Customer>
  deleteCustomer: (id: string) => Promise<void>
  createSale: (input: SaleInput) => Promise<Sale>
  updateSettings: (patch: Partial<Settings>) => Promise<Settings>
  exportBackup: () => void
  importBackup: (file: File) => Promise<void>
  restoreSeed: () => Promise<void>
  resetData: () => Promise<void>
  stats: ReturnType<typeof dashboardService.getStats>
  salesChart: ReturnType<typeof dashboardService.salesChart>
  statusChart: ReturnType<typeof dashboardService.statusChart>
  reports: typeof reportService
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [settings, setSettings] = useState<Settings>(settingsService.get())
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [history, setHistory] = useState<HistoryEvent[]>([])
  const [filters, setFilters] = useState<VehicleFilters>({})
  const [tick, setTick] = useState(0)

  const refresh = useCallback(() => {
    const db = loadDatabase()
    setVehicles(db.vehicles)
    setExpenses(db.expenses)
    setCustomers(db.customers)
    setSales(db.sales)
    setHistory(db.history)
    setSettings(settingsService.get())
    setTick((t) => t + 1)
  }, [])

  useEffect(() => {
    refresh()
    setUser(authService.getCurrentUser())
    setReady(true)
  }, [refresh])

  const toast = useCallback((message: string, type: ToastItem['type'] = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const withLoading = useCallback(async <T,>(fn: () => Promise<T> | T): Promise<T> => {
    setLoading(true)
    try {
      return await fn()
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(
    async (username: string, password: string, remember: boolean) => {
      await withLoading(async () => {
        const result = authService.login(username, password, remember)
        if (!result.success || !result.user) {
          throw new Error(result.message)
        }
        setUser(result.user)
        toast('Bem-vindo ao Maciel Motors Gestor')
      })
    },
    [toast, withLoading],
  )

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    toast('Sessão encerrada', 'info')
  }, [toast])

  const wrap =
    <A extends unknown[], R>(fn: (...args: A) => R | Promise<R>, successMsg?: string) =>
    async (...args: A): Promise<R> => {
      setLoading(true)
      try {
        const result = await fn(...args)
        refresh()
        if (successMsg) toast(successMsg)
        return result
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Erro inesperado'
        toast(msg, 'error')
        throw e
      } finally {
        setLoading(false)
      }
    }

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      user,
      loading,
      toasts,
      settings,
      vehicles,
      expenses,
      customers,
      sales,
      history,
      filters,
      setFilters,
      refresh,
      login,
      logout,
      toast,
      dismissToast,
      withLoading,
      createVehicle: wrap((input: VehicleInput) => vehicleService.create(input), 'Veículo cadastrado'),
      updateVehicle: wrap(
        (id: string, patch: Partial<VehicleInput>) => vehicleService.update(id, patch),
        'Veículo atualizado',
      ),
      deleteVehicle: wrap((id: string) => vehicleService.remove(id), 'Veículo excluído'),
      duplicateVehicle: wrap(
        (id: string) => vehicleService.duplicate(id),
        'Veículo duplicado',
      ),
      archiveVehicle: wrap((id: string) => {
        vehicleService.archive(id)
      }, 'Veículo arquivado'),
      restoreVehicle: wrap((id: string) => {
        vehicleService.restore(id)
      }, 'Veículo restaurado'),
      createExpense: wrap(
        (input: ExpenseInput) => expenseService.create(input),
        'Despesa registrada',
      ),
      updateExpense: wrap(
        (id: string, patch: Partial<ExpenseInput>) => expenseService.update(id, patch),
        'Despesa atualizada',
      ),
      deleteExpense: wrap((id: string) => expenseService.remove(id), 'Despesa excluída'),
      createCustomer: wrap(
        (input: CustomerInput) => customerService.create(input),
        'Cliente cadastrado',
      ),
      updateCustomer: wrap(
        (id: string, patch: Partial<CustomerInput>) => customerService.update(id, patch),
        'Cliente atualizado',
      ),
      deleteCustomer: wrap((id: string) => customerService.remove(id), 'Cliente excluído'),
      createSale: wrap((input: SaleInput) => saleService.create(input), 'Venda registrada'),
      updateSettings: wrap(
        (patch: Partial<Settings>) => settingsService.update(patch),
        'Configurações salvas',
      ),
      exportBackup: () => {
        backupService.exportJSON()
        toast('Backup exportado')
      },
      importBackup: wrap(async (file: File) => {
        await backupService.importJSON(file)
      }, 'Backup importado com sucesso'),
      restoreSeed: wrap(() => {
        backupService.restoreSeed()
      }, 'Dados de demonstração restaurados'),
      resetData: wrap(() => {
        backupService.resetAll()
      }, 'Dados resetados'),
      stats: dashboardService.getStats(),
      salesChart: dashboardService.salesChart(),
      statusChart: dashboardService.statusChart(),
      reports: reportService,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ready, user, loading, toasts, settings, vehicles, expenses, customers, sales, history, filters, tick],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
