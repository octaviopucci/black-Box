'use client'

import Link from 'next/link'
import { Bell, Heart, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import { BRAND, ROUTES } from '@/constants/brand'
import { IconButton } from '@/components/ui/icon-button'
import { SearchInput } from '@/components/ui/search-input'
import { useAppStore } from '@/stores/app-store'
import { notificationService } from '@/services'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AppHeaderProps {
  showSearch?: boolean
  sticky?: boolean
}

export function AppHeader({ showSearch = true, sticky = true }: AppHeaderProps) {
  const router = useRouter()
  const { searchQuery, setSearchQuery, favorites } = useAppStore()
  const [localQuery, setLocalQuery] = useState(searchQuery)
  const unread = notificationService.unreadCount()

  const onSearch = (value?: string) => {
    const q = value ?? localQuery
    setSearchQuery(q)
    router.push(`${ROUTES.resultados}?q=${encodeURIComponent(q)}`)
  }

  return (
    <header
      className={
        sticky
          ? 'sticky top-0 z-30 border-b border-border/60 bg-card/90 backdrop-blur-xl'
          : 'border-b border-border/60 bg-card'
      }
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link href={ROUTES.home} className="flex shrink-0 items-center gap-2" aria-label="CBX início">
          <motion.span
            whileHover={{ scale: 1.05 }}
            className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-[#9333ea] to-accent text-sm font-bold text-white shadow-md shadow-primary/25"
          >
            CB
          </motion.span>
          <span className="hidden sm:block">
            <span className="block text-base font-bold tracking-tight text-foreground">{BRAND.name}</span>
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
              <MapPin className="size-2.5" aria-hidden />
              Capão Bonito
            </span>
          </span>
        </Link>

        {showSearch && (
          <div className="min-w-0 flex-1">
            <SearchInput
              value={localQuery}
              onValueChange={setLocalQuery}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSearch()
              }}
              placeholder="Buscar no CBX..."
              aria-label="Buscar produtos"
            />
          </div>
        )}

        <div className="flex items-center gap-1">
          <IconButton
            aria-label={`Favoritos${favorites.length ? `, ${favorites.length}` : ''}`}
            onClick={() => router.push(ROUTES.favoritos)}
          >
            <Heart className="size-5" />
          </IconButton>
          <IconButton
            aria-label={`Notificações${unread ? `, ${unread} não lidas` : ''}`}
            onClick={() => router.push(ROUTES.notificacoes)}
            className="relative"
          >
            <Bell className="size-5" />
            {unread > 0 && (
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-danger ring-2 ring-card" />
            )}
          </IconButton>
        </div>
      </div>
    </header>
  )
}
