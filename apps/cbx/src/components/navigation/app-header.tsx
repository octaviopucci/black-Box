'use client'

import { Bell, Heart } from 'lucide-react'
import { ROUTES } from '@/constants/brand'
import { BrandLogo } from '@/components/brand/brand-assets'
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
        <BrandLogo size={44} className="rounded-lg bg-black" />

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
