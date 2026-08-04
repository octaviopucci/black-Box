'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Bell,
  Heart,
  MessageCircle,
  Megaphone,
  Settings,
  Tag,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { EmptyState } from '@/components/ui/empty-state'
import { formatRelativeDate } from '@/lib/utils'
import { notificationService } from '@/services'
import type { AppNotification, NotificationType } from '@/types'
import { staggerContainer, staggerItem } from '@/animations/variants'

const ICONS: Record<NotificationType, LucideIcon> = {
  mensagem: MessageCircle,
  favorito: Heart,
  sistema: Settings,
  promocao: Tag,
  anuncio: Megaphone,
}

const ICON_COLORS: Record<NotificationType, string> = {
  mensagem: 'bg-primary/10 text-primary',
  favorito: 'bg-danger/10 text-danger',
  sistema: 'bg-muted text-muted-foreground',
  promocao: 'bg-secondary/10 text-secondary',
  anuncio: 'bg-success/10 text-success',
}

function NotificationItem({ notification }: { notification: AppNotification }) {
  const Icon = ICONS[notification.type]
  const colorClass = ICON_COLORS[notification.type]

  const content = (
  <>
      <div className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${colorClass}`}>
        <Icon className="size-5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
            {notification.title}
          </p>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatRelativeDate(notification.createdAt)}
          </span>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{notification.body}</p>
      </div>
      {!notification.read && (
        <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" aria-label="Não lida" />
      )}
    </>
  )

  const className = `flex items-start gap-3 p-4 transition-colors hover:bg-muted/50 ${
    !notification.read ? 'bg-primary/5' : ''
  }`

  if (notification.href) {
    return (
      <Link href={notification.href} className={className}>
        {content}
      </Link>
    )
  }

  return <div className={className}>{content}</div>
}

export default function NotificacoesPage() {
  const notifications = notificationService.list()

  return (
    <PageShell>
      <Container className="py-6">
        <SectionHeader
          title="Notificações"
          subtitle={`${notificationService.unreadCount()} não lidas`}
        />

        {notifications.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="Tudo em dia"
            description="Você não tem notificações no momento."
          />
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="divide-y divide-border/60 rounded-xl border border-border/60 bg-card overflow-hidden"
          >
            {notifications.map((notification) => (
              <motion.div key={notification.id} variants={staggerItem}>
                <NotificationItem notification={notification} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
    </PageShell>
  )
}
