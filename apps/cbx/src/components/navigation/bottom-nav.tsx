'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, PlusCircle, MessageCircle, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/constants/brand'
import { chatService } from '@/services'

const items = [
  { href: ROUTES.home, label: 'Início', icon: Home },
  { href: ROUTES.busca, label: 'Buscar', icon: Search },
  { href: ROUTES.publicar, label: 'Anunciar', icon: PlusCircle, primary: true },
  { href: ROUTES.chat, label: 'Chat', icon: MessageCircle, badge: true },
  { href: ROUTES.perfil, label: 'Perfil', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()
  const unread = chatService.conversations().reduce((a, c) => a + c.unread, 0)

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 backdrop-blur-xl md:hidden"
      aria-label="Navegação principal"
    >
      <ul className="mx-auto flex h-16 max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const active =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  'relative flex h-full flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground',
                  item.primary && !active && 'text-secondary',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <span className="relative">
                  {item.primary ? (
                    <span className="flex size-10 -mt-3 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30">
                      <Icon className="size-5" aria-hidden />
                    </span>
                  ) : (
                    <Icon className={cn('size-5', active && 'stroke-[2.5]')} aria-hidden />
                  )}
                  {item.badge && unread > 0 && (
                    <span className="absolute -right-2 -top-1 flex size-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white">
                      {unread > 9 ? '9+' : unread}
                    </span>
                  )}
                  {active && !item.primary && (
                    <motion.span
                      layoutId="bottom-nav-dot"
                      className="absolute -bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-primary"
                    />
                  )}
                </span>
                {!item.primary && <span>{item.label}</span>}
                {item.primary && <span className="mt-0.5">{item.label}</span>}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
