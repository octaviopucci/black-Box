'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  LayoutGrid,
  Store,
  Crown,
  Megaphone,
  Package,
  Settings,
  HelpCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { BRAND, ROUTES } from '@/constants/brand'

const links = [
  { href: ROUTES.home, label: 'Início', icon: Home },
  { href: ROUTES.categorias, label: 'Categorias', icon: LayoutGrid },
  { href: ROUTES.lojas, label: 'Lojas', icon: Store },
  { href: ROUTES.meusAnuncios, label: 'Meus anúncios', icon: Package },
  { href: ROUTES.publicar, label: 'Anunciar', icon: Megaphone },
  { href: ROUTES.planos, label: 'Planos', icon: Crown },
  { href: ROUTES.configuracoes, label: 'Configurações', icon: Settings },
  { href: ROUTES.ajuda, label: 'Ajuda', icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-border/70 bg-card p-4 lg:block">
      <Link href={ROUTES.home} className="mb-8 flex items-center gap-2.5 px-2">
        <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-[#9333ea] to-accent text-sm font-bold text-white shadow-md shadow-primary/25">
          CB
        </span>
        <span>
          <span className="block text-lg font-bold tracking-tight">{BRAND.name}</span>
          <span className="text-[11px] text-muted-foreground">Capão Bonito</span>
        </span>
      </Link>
      <nav aria-label="Menu lateral">
        <ul className="space-y-1">
          {links.map((link) => {
            const active =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
            const Icon = link.icon
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="size-4.5" aria-hidden />
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
