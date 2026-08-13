import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  GitBranch,
  Inbox,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Menu,
  MessageCircle,
  Radio,
  Settings,
  Sparkles,
  Users,
  X,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { Logo } from '@/components/Logo'
import { useChama } from '@/store/ChamaContext'

const nav = [
  { to: '/app', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/inbox', label: 'Inbox', icon: Inbox },
  { to: '/app/contacts', label: 'Contatos', icon: Users },
  { to: '/app/flows', label: 'Flows', icon: GitBranch },
  { to: '/app/automations', label: 'Automações', icon: Zap },
  { to: '/app/broadcasts', label: 'Broadcasts', icon: Megaphone },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/app/channels', label: 'Canais', icon: Radio },
  { to: '/app/growth', label: 'Growth', icon: Sparkles },
  { to: '/app/simulator', label: 'Simulador', icon: MessageCircle },
  { to: '/app/settings', label: 'Configurações', icon: Settings },
]

export function AppLayout() {
  const { state, logout } = useChama()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const unread = state.conversations.reduce((a, c) => a + c.unread, 0)

  return (
    <div className="min-h-screen bg-hero text-paper">
      <div className="pointer-events-none fixed inset-0 bg-grain opacity-[0.07]" />
      <div className="relative flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-line bg-night/95 p-4 backdrop-blur transition-transform lg:static lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="mb-8 flex items-center justify-between">
            <Logo />
            <button
              type="button"
              className="rounded-lg p-2 text-mist lg:hidden"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex flex-col gap-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-flame/15 text-flame'
                      : 'text-mist hover:bg-slateDeep hover:text-paper'
                  }`
                }
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {item.to === '/app/inbox' && unread > 0 ? (
                  <span className="rounded-full bg-flame px-1.5 py-0.5 text-[10px] font-bold text-night">
                    {unread}
                  </span>
                ) : null}
              </NavLink>
            ))}
          </nav>
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-line bg-abyss p-3">
            <p className="text-sm font-semibold">{state.user?.name}</p>
            <p className="text-xs text-mist">{state.user?.email}</p>
            <p className="mt-1 text-[10px] uppercase tracking-wider text-ember">
              plano {state.user?.plan}
            </p>
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/login')
              }}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-line px-3 py-2 text-xs font-semibold text-mist hover:border-flame hover:text-flame"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sair
            </button>
          </div>
        </aside>

        {open ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-night/60 lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-night/80 px-4 py-3 backdrop-blur lg:hidden">
            <button
              type="button"
              className="rounded-lg border border-line p-2"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Logo size="sm" />
          </header>
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
