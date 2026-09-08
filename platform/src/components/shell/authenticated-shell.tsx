'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/primitives'
import type { SafeOrganization, SafeUser } from '@/lib/auth/context'

type AuthenticatedShellProps = {
  user: SafeUser
  organization: SafeOrganization | null
  children: React.ReactNode
}

export function AuthenticatedShell({ user, organization, children }: AuthenticatedShellProps) {
  const router = useRouter()
  const pathname = usePathname()

  async function onLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.replace('/login')
    router.refresh()
  }

  function navClass(href: string) {
    const active = href === '/app' ? pathname === '/app' : pathname.startsWith(href)
    return active
      ? 'rounded-md bg-zinc-100 px-3 py-1.5 text-sm text-zinc-950'
      : 'rounded-md px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900'
  }

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 text-xs font-bold text-zinc-950">
              BB
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-100">Black Box</p>
              <p className="text-xs text-zinc-500">
                {organization ? organization.name : 'No active organization'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-zinc-400 sm:inline">{user.email}</span>
            <Button variant="secondary" onClick={() => void onLogout()}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <nav aria-label="Primary" className="border-b border-zinc-800 bg-zinc-950">
        <div className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-6">
          <Link href="/app" className={navClass('/app')}>
            Home
          </Link>
          <Link href="/app/partners" className={navClass('/app/partners')}>
            Partners
          </Link>
          <Link href="/app/products" className={navClass('/app/products')}>
            Products
          </Link>
          <span className="cursor-not-allowed whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-zinc-500" title="Mission 12">
            Dashboard
          </span>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  )
}
