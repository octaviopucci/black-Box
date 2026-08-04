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
import { ROUTES } from '@/constants/brand'
import { BrandLogo } from '@/components/brand/brand-assets'

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
      <div className="mb-8 px-1">
        <BrandLogo size={72} className="rounded-xl bg-black" />
      </div>
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
