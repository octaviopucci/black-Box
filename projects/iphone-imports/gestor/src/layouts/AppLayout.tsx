import { Link, Outlet, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Boxes,
  Tags,
  Users,
  Settings,
  LogOut,
  Apple,
} from 'lucide-react'
import { clearSession, getSession, loadDatabase } from '@/services/database'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/estoque', label: 'Estoque', icon: Boxes },
  { to: '/produtos', label: 'Produtos', icon: Package },
  { to: '/categorias', label: 'Categorias', icon: Tags },
  { to: '/clientes', label: 'CRM', icon: Users },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]

export function AppLayout() {
  const { pathname } = useLocation()
  const session = getSession()
  const db = loadDatabase()

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 shrink-0 flex-col border-r border-brand-border bg-brand-surface p-4">
        <div className="mb-8 flex items-center gap-2 px-2">
          <Apple className="h-6 w-6 text-brand-silver" />
          <div>
            <p className="text-sm font-black">iPhone Imports</p>
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
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active ? 'bg-brand-silver text-brand-black' : 'text-brand-gray hover:bg-white/5 hover:text-white'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className="mt-4 border-t border-brand-border pt-4">
          <p className="px-2 text-xs text-brand-gray">{session?.nome}</p>
          <p className="px-2 text-[10px] text-brand-gray">{db?.settings.storeName}</p>
          <button
            onClick={() => {
              clearSession()
              window.location.href = '/login'
            }}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
