import Link from 'next/link'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Home', href: '/', enabled: true },
  { label: 'Sign in', href: '/login', enabled: true },
  { label: 'Dashboard', href: '#', enabled: false, note: 'Mission 12' },
  { label: 'Opportunities', href: '#', enabled: false, note: 'Mission 05–06' },
  { label: 'Products', href: '#', enabled: false, note: 'Mission 07' },
  { label: 'Sales', href: '#', enabled: false, note: 'Mission 08' },
]

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 text-xs font-bold text-zinc-950"
            aria-hidden
          >
            BB
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-100">Black Box</p>
            <p className="text-xs text-zinc-500">Platform foundation</p>
          </div>
        </div>
        <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400">
          Mission 02
        </span>
      </div>
    </header>
  )
}

export function AppNavigation() {
  return (
    <nav
      aria-label="Primary"
      className="border-b border-zinc-800 bg-zinc-950"
    >
      <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-6">
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </div>
    </nav>
  )
}

function NavItem({
  label,
  href,
  enabled,
  note,
}: {
  label: string
  href: string
  enabled: boolean
  note?: string
}) {
  const className = cn(
    'whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition-colors',
    enabled
      ? 'bg-zinc-100 text-zinc-950'
      : 'cursor-not-allowed text-zinc-500',
  )

  if (!enabled) {
    return (
      <span className={className} title={note ? `Available in ${note}` : undefined}>
        {label}
      </span>
    )
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <AppHeader />
      <AppNavigation />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  )
}
