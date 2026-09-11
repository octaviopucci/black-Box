import { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { cloudSync, fetchStorageHealth } from '@/services/sync'
import {
  LayoutDashboard,
  Package,
  Boxes,
  Tags,
  Users,
  Settings,
  LogOut,
  Play,
  Menu,
  X,
} from 'lucide-react'
import { SyncStatus } from '@/components/SyncStatus'
import { clearSession, getSession, loadDatabase } from '@/services/database'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/estoque', label: 'Estoque', icon: Boxes },
  { to: '/produtos', label: 'Produtos', icon: Package },
  { to: '/categorias', label: 'Categorias', icon: Tags },
  { to: '/clientes', label: 'CRM', icon: Users },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

function SidebarContent({
  pathname,
  session,
  storeName,
  onNavigate,
  activeClass,
}: {
  pathname: string
  session: ReturnType<typeof getSession>
  storeName?: string
  onNavigate?: () => void
  activeClass: string
}) {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')

  return (
    <>
      <div className="mb-6 flex items-center gap-2 px-2 lg:mb-8">
        <Play className="h-6 w-6 shrink-0 fill-brand-purple text-brand-purple" />
        <div className="min-w-0">
          <p className="truncate text-sm font-black">WebTube</p>
          <p className="text-[10px] text-brand-gray">Gestor</p>
        </div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {nav.map((item) => {
          const active = pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? activeClass : 'text-brand-gray hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="mt-4 border-t border-brand-border pt-4">
        <SyncStatus />
        <p className="mt-2 truncate px-2 text-xs text-brand-gray">{session?.nome}</p>
        <p className="truncate px-2 text-[10px] text-brand-gray">{storeName}</p>
        <button
          onClick={() => {
            clearSession()
            window.location.href = `${base}/login`
          }}
          className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </>
  )
}

export function AppLayout() {
  const { pathname } = useLocation()
  const session = getSession()
  const db = loadDatabase()
  const [storageWarning, setStorageWarning] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    void (async () => {
      const valid = await cloudSync.validateSession()
      if (!valid) return
      const health = await fetchStorageHealth()
      if (!health.configured) {
        setStorageWarning(
          health.setup ||
            'Armazenamento na nuvem não configurado. Conecte Vercel Blob ao projeto loja-iphoneimports.',
        )
      }
    })()
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const activeClass = 'bg-brand-purple text-white'

  return (
    <div className="flex min-h-screen min-h-dvh flex-col lg:flex-row">
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-brand-border bg-brand-surface px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-brand-gray hover:bg-white/5 hover:text-white"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
          <Play className="h-5 w-5 shrink-0 fill-brand-purple text-brand-purple" />
          <p className="truncate text-sm font-black">WebTube</p>
        </div>
        <div className="w-9" aria-hidden />
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/70"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-[min(18rem,88vw)] flex-col border-r border-brand-border bg-brand-surface p-4 shadow-2xl">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-brand-gray hover:bg-white/5 hover:text-white"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent
              pathname={pathname}
              session={session}
              storeName={db?.settings.storeName}
              onNavigate={() => setMobileOpen(false)}
              activeClass={activeClass}
            />
          </aside>
        </div>
      )}

      <aside className="hidden w-60 shrink-0 flex-col border-r border-brand-border bg-brand-surface p-4 lg:flex">
        <SidebarContent
          pathname={pathname}
          session={session}
          storeName={db?.settings.storeName}
          activeClass={activeClass}
        />
      </aside>

      <main className="flex-1 min-w-0 overflow-x-hidden p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:p-6">
        <div className="mb-4 space-y-2">
          <div className="rounded-lg border border-brand-purple/30 bg-brand-purple/10 px-3 py-2 text-xs leading-relaxed text-brand-glow sm:px-4">
            Este gestor atualiza o site <strong className="text-white">/w-tube</strong> — não confunda com{' '}
            <strong className="text-white">/gestor</strong> (iPhone Imports).
          </div>
          {storageWarning && (
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs leading-relaxed text-amber-200 sm:px-4">
              {storageWarning}
            </div>
          )}
        </div>
        <Outlet />
      </main>
    </div>
  )
}
