import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Archive,
  BarChart3,
  Car,
  ChevronLeft,
  Database,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  Settings,
  Users,
  Wallet,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { MacielLogo } from '@/components/common/MacielLogo'
import { LoadingOverlay, Toast } from '@/components/ui/Feedback'
import { useApp } from '@/context/AppContext'
import { isInteractive } from '@/config/variant'
import { cn } from '@/utils'

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/estoque', label: 'Estoque', icon: Car },
  { to: '/veiculos/novo', label: 'Cadastrar veículo', icon: PlusCircle },
  { to: '/financeiro', label: 'Financeiro', icon: Wallet },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/relatorios', label: 'Relatórios', icon: BarChart3 },
  { to: '/backup', label: 'Backup', icon: Database },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

export function AppLayout() {
  const { user, logout, loading, settings } = useApp()
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-brand-gray/40 px-4 py-5">
        <MacielLogo compact showText={!collapsed} />
        <button
          type="button"
          className="hidden rounded-lg p-1.5 text-white/50 hover:bg-white/5 lg:inline-flex"
          onClick={() => setCollapsed((v) => !v)}
        >
          <ChevronLeft className={cn('h-4 w-4 transition', collapsed && 'rotate-180')} />
        </button>
        <button
          type="button"
          className="rounded-lg p-1.5 text-white/50 hover:bg-white/5 lg:hidden"
          onClick={() => setOpen(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive
                  ? 'bg-brand-red/15 text-white ring-1 ring-brand-red/40'
                  : 'text-white/60 hover:bg-white/5 hover:text-white',
                collapsed && 'justify-center px-2',
              )
            }
          >
            <item.icon className="h-4.5 w-4.5 shrink-0" />
            {!collapsed ? <span>{item.label}</span> : null}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-brand-gray/40 p-3">
        {!collapsed ? (
          <div className="mb-3 rounded-xl bg-brand-black/50 px-3 py-2">
            <p className="truncate text-sm font-medium">{user?.nome}</p>
            <p className="truncate text-xs text-white/40">{settings.nomeEmpresa}</p>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => {
            logout()
            navigate('/login')
          }}
          className={cn(
            'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/60 transition hover:bg-white/5 hover:text-white',
            collapsed && 'justify-center',
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed ? 'Sair' : null}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-brand-black text-white">
      <Toast />
      <LoadingOverlay show={loading} />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden border-r border-brand-gray/40 bg-brand-graphite/95 backdrop-blur lg:block',
          collapsed ? 'w-[76px]' : 'w-64',
        )}
      >
        {SidebarContent}
      </aside>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-brand-gray/40 bg-brand-graphite lg:hidden"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              {SidebarContent}
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <div className={cn('min-h-screen', collapsed ? 'lg:pl-[76px]' : 'lg:pl-64')}>
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-brand-gray/40 bg-brand-black/80 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-xl border border-brand-gray/50 p-2 lg:hidden"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="font-display text-lg font-semibold tracking-wide sm:text-xl">
                {settings.nomeEmpresa || 'Maciel Motors Gestor'}
              </p>
              <p className="text-xs text-white/40">
                {isInteractive
                  ? 'Versão interativa · compare com /maciel-motors/'
                  : 'Gestão profissional de estoque'}
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <Archive className="h-4 w-4 text-brand-red" />
            <span className="text-xs text-white/50">Sistema online · LocalStorage</span>
          </div>
        </header>

        <main className="px-4 py-5 sm:px-6 sm:py-6">
          <Outlet />
        </main>

        <footer className="border-t border-brand-gray/30 px-4 py-4 text-center text-xs text-white/35 sm:px-6">
          © {new Date().getFullYear()} Maciel Motors Gestor · Todos os direitos reservados
        </footer>
      </div>
    </div>
  )
}
