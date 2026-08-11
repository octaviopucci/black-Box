import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  AlertTriangle,
  BarChart3,
  Brain,
  Car,
  ClipboardCheck,
  Cloud,
  CloudOff,
  Database,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Receipt,
  Search,
  Settings,
  Shield,
  Table2,
  TrendingUp,
  Users,
  Wallet,
  Wrench,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { LpLogo } from '@/components/common/LpLogo'
import { LoadingOverlay, Toast } from '@/components/ui/Feedback'
import { useApp } from '@/context/AppContext'
import { vehicleService } from '@/services/vehicles'
import { cn, formatCurrency } from '@/utils'
import { APP_NAME } from '@/config/variant'
import type { SyncStatus } from '@/services/sync'

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard }

const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Principal',
    items: [
      { to: '/', label: 'Centro de Comando', icon: LayoutDashboard },
      { to: '/estoque', label: 'Estoque', icon: Car },
      { to: '/alertas', label: 'Alertas', icon: AlertTriangle },
      { to: '/inteligencia', label: 'Inteligência', icon: Brain },
      { to: '/fipe', label: 'FIPE / Placa', icon: Table2 },
    ],
  },
  {
    title: 'Operação',
    items: [
      { to: '/preparacao', label: 'Preparação', icon: Wrench },
      { to: '/documentos', label: 'Documentos', icon: FileText },
      { to: '/fornecedores', label: 'Fornecedores', icon: Users },
    ],
  },
  {
    title: 'Financeiro',
    items: [
      { to: '/financeiro', label: 'Financeiro', icon: Wallet },
      { to: '/contas', label: 'Contas a pagar', icon: Receipt },
      { to: '/rentabilidade', label: 'Rentabilidade', icon: TrendingUp },
    ],
  },
  {
    title: 'Relatórios',
    items: [{ to: '/relatorios', label: 'Relatórios', icon: BarChart3 }],
  },
  {
    title: 'Admin',
    items: [
      { to: '/usuarios', label: 'Usuários', icon: Users },
      { to: '/configuracoes', label: 'Configurações', icon: Settings },
      { to: '/auditoria', label: 'Auditoria', icon: Shield },
      { to: '/backup', label: 'Backup', icon: Database },
    ],
  },
]

const MOBILE_QUICK = [
  { to: '/veiculos/novo', label: 'Novo veículo', icon: Car },
  { to: '/fipe', label: 'FIPE', icon: Table2 },
  { to: '/documentos', label: 'Documento', icon: FileText },
  { to: '/preparacao', label: 'Checklist', icon: ClipboardCheck },
]

function SyncIndicator({ status, onSync }: { status: SyncStatus; onSync: () => void }) {
  const labels: Record<SyncStatus, string> = {
    idle: 'Verificando…',
    syncing: 'Sincronizando…',
    synced: 'Sincronizado',
    'device-only': 'Só neste aparelho',
    offline: 'Offline',
    error: 'Erro de sync',
  }
  const colors: Record<SyncStatus, string> = {
    idle: 'text-lp-steel',
    syncing: 'text-lp-accent animate-pulse',
    synced: 'text-lp-ok',
    'device-only': 'text-lp-copper',
    offline: 'text-lp-copper',
    error: 'text-lp-danger',
  }
  const titles: Record<SyncStatus, string> = {
    idle: 'Verificando sync',
    syncing: 'Sincronizando com a nuvem…',
    synced: 'Dados na nuvem — PC e celular compartilham a mesma base',
    'device-only':
      'API online, mas sem Vercel Blob: os dados ficam só neste aparelho. Configure BLOB_READ_WRITE_TOKEN.',
    offline: 'Sem conexão com a API de sync',
    error: 'Falha ao sincronizar — toque para tentar de novo',
  }
  const Icon = status === 'offline' || status === 'device-only' ? CloudOff : Cloud

  return (
    <button
      type="button"
      onClick={onSync}
      className={cn('btn-ghost inline-flex items-center gap-1.5 text-xs', colors[status])}
      title={titles[status]}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{labels[status]}</span>
    </button>
  )
}

export function AppLayout() {
  const { user, logout, loading, settings, syncStatus, syncNow, alerts } = useApp()
  const showDeviceBanner = syncStatus === 'device-only'
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const results = useMemo(() => {
    if (!search.trim()) return []
    return vehicleService.globalSearch(search).slice(0, 8)
  }, [search])

  const criticalCount = alerts.filter((a) => a.severity === 'critico').length

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const pickResult = (id: string) => {
    setSearch('')
    setSearchOpen(false)
    navigate(`/veiculos/${id}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-lp-paper text-lp-ink">
      <Toast />
      <LoadingOverlay show={loading} />

      {/* Top command bar */}
      <header className="sticky top-0 z-40 border-b border-lp-line bg-white/90 backdrop-blur-md">
        <div className="flex h-14 items-center gap-3 px-3 sm:px-4 lg:px-5">
          <button
            type="button"
            className="btn-ghost p-2 lg:hidden"
            onClick={() => setDrawerOpen(true)}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <NavLink to="/" className="flex shrink-0 items-center gap-2">
            <LpLogo compact size="sm" showText={false} />
            <span className="hidden font-display text-sm font-bold tracking-tight text-lp-ink sm:inline">
              {settings.nomeCurto || settings.nomeEmpresa}
            </span>
          </NavLink>

          <div ref={searchRef} className="relative mx-auto hidden max-w-xl flex-1 md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-lp-steel/50" />
            <input
              className="input-field pl-9 pr-4 py-2 text-sm"
              placeholder="Buscar placa, modelo, marca, chassi, renavam, código…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setSearchOpen(true)
              }}
              onFocus={() => setSearchOpen(true)}
            />
            {searchOpen && search.trim() ? (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-lp-line bg-white shadow-lift">
                {results.length ? (
                  results.map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      className="flex w-full items-center justify-between gap-3 border-b border-lp-line/60 px-4 py-2.5 text-left text-sm hover:bg-lp-mist/60 last:border-0"
                      onClick={() => pickResult(v.id)}
                    >
                      <span>
                        <strong>
                          {v.marca} {v.modelo}
                        </strong>
                        <span className="ml-2 text-lp-steel">
                          {v.placa || v.codigoInterno}
                        </span>
                      </span>
                      <span className="text-xs text-lp-steel">
                        {v.precoAnunciado ? formatCurrency(v.precoAnunciado) : '—'}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-3 text-sm text-lp-steel">Nenhum veículo encontrado</p>
                )}
              </div>
            ) : null}
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <SyncIndicator status={syncStatus} onSync={() => void syncNow()} />
            <NavLink to="/veiculos/novo" className="btn-primary hidden py-2 text-xs sm:inline-flex">
              <Plus className="h-4 w-4" />
              <span className="hidden lg:inline">Novo veículo</span>
            </NavLink>
            <div className="hidden items-center gap-2 rounded-lg border border-lp-line bg-lp-mist/40 px-2.5 py-1.5 sm:flex">
              <div className="h-7 w-7 rounded-full bg-lp-accent/15 text-center text-xs font-bold leading-7 text-lp-accent">
                {(user?.nome || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="hidden text-left lg:block">
                <p className="text-xs font-semibold leading-tight">{user?.nome}</p>
                <p className="text-[10px] uppercase tracking-wider text-lp-steel">{user?.role}</p>
              </div>
              <button type="button" className="btn-ghost p-1" onClick={logout} title="Sair">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary horizontal nav — desktop */}
        <nav className="hidden border-t border-lp-line/80 bg-lp-mist/30 lg:block">
          <div className="flex items-center gap-1 overflow-x-auto px-4 py-1.5">
            {NAV_GROUPS.flatMap((g) => g.items).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'relative whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-semibold transition',
                    isActive
                      ? 'bg-white text-lp-accent shadow-sm'
                      : 'text-lp-steel hover:bg-white/60 hover:text-lp-ink',
                  )
                }
              >
                {item.label}
                {item.to === '/alertas' && criticalCount > 0 ? (
                  <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-lp-danger px-1 text-[10px] text-white">
                    {criticalCount}
                  </span>
                ) : null}
              </NavLink>
            ))}
          </div>
        </nav>
      </header>

      <div className="flex flex-1">
        {/* Icon rail — desktop */}
        <aside className="hidden w-[72px] shrink-0 flex-col border-r border-lp-line bg-white lg:flex">
          <nav className="flex flex-1 flex-col gap-4 overflow-y-auto py-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="space-y-1 px-2">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    title={item.label}
                    className={({ isActive }) =>
                      cn(
                        'relative flex flex-col items-center gap-0.5 rounded-xl px-2 py-2.5 text-[10px] font-semibold transition',
                        isActive
                          ? 'bg-lp-accent/10 text-lp-accent'
                          : 'text-lp-steel hover:bg-lp-mist hover:text-lp-ink',
                      )
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="max-w-full truncate text-center leading-tight">
                      {item.label.split(' ')[0]}
                    </span>
                    {item.to === '/alertas' && criticalCount > 0 ? (
                      <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-lp-danger" />
                    ) : null}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </aside>

        {/* Mobile drawer */}
        {drawerOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-lp-ink/40"
              onClick={() => setDrawerOpen(false)}
              aria-label="Fechar menu"
            />
            <div className="absolute bottom-0 left-0 top-0 flex w-[min(100%,300px)] flex-col bg-white shadow-lift">
              <div className="flex items-center justify-between border-b border-lp-line px-4 py-4">
                <LpLogo size="sm" />
                <button type="button" className="btn-ghost p-2" onClick={() => setDrawerOpen(false)}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-3">
                {NAV_GROUPS.map((group) => (
                  <div key={group.title} className="mb-4">
                    <p className="mb-1 px-2 text-[10px] font-bold uppercase tracking-[0.14em] text-lp-steel">
                      {group.title}
                    </p>
                    {group.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/'}
                        onClick={() => setDrawerOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
                            isActive ? 'bg-lp-accent/10 text-lp-accent' : 'text-lp-ink hover:bg-lp-mist',
                          )
                        }
                      >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                ))}
              </nav>
              <div className="border-t border-lp-line p-4">
                <p className="text-sm font-semibold">{user?.nome}</p>
                <button type="button" className="btn-ghost mt-2 text-lp-danger" onClick={logout}>
                  <LogOut className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <main className="flex-1 overflow-x-hidden px-3 py-4 pb-24 sm:px-5 sm:py-6 lg:pb-6">
          {showDeviceBanner ? (
            <div
              role="status"
              className="mb-4 flex flex-wrap items-start gap-3 rounded-xl border border-lp-copper/40 bg-lp-copper/10 px-4 py-3 text-sm text-lp-ink"
            >
              <CloudOff className="mt-0.5 h-4 w-4 shrink-0 text-lp-copper" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-lp-copper">Dados só neste aparelho</p>
                <p className="mt-0.5 text-lp-steel">
                  A API responde, mas o Vercel Blob ainda não está configurado. PC e celular não
                  vão bater até existir a variável{' '}
                  <code className="rounded bg-lp-mist px-1 text-xs">BLOB_READ_WRITE_TOKEN</code> no
                  projeto Vercel. Veja o passo a passo em Configurações → Sincronização.
                </p>
              </div>
              <NavLink to="/configuracoes" className="btn-ghost shrink-0 text-xs text-lp-copper">
                Abrir checklist
              </NavLink>
            </div>
          ) : null}
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom quick actions */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-lp-line bg-white/95 px-2 py-2 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-lg items-stretch justify-around gap-1">
          {MOBILE_QUICK.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10px] font-semibold',
                  isActive ? 'text-lp-accent' : 'text-lp-steel',
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.label.split(' ')[0]}
            </NavLink>
          ))}
        </div>
      </nav>

      <footer className="hidden border-t border-lp-line bg-white px-5 py-3 text-center text-xs text-lp-steel lg:block">
        © {new Date().getFullYear()} {settings.nomeEmpresa || APP_NAME}
      </footer>
    </div>
  )
}
