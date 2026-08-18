'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { Avatar } from '@/components/ui/avatar'
import { EmptyState } from '@/components/ui/empty-state'
import { ROUTES } from '@/constants/brand'
import { formatRelativeDate } from '@/lib/utils'
import { chatService } from '@/services'
import { staggerContainer, staggerItem } from '@/animations/variants'

export default function ChatPage() {
  const conversations = chatService.conversations()

  return (
    <PageShell>
      <Container className="py-6">
        <SectionHeader title="Mensagens" subtitle="Suas conversas no CBX" />

        {conversations.length === 0 ? (
          <EmptyState
            icon={MessageCircle}
            title="Nenhuma conversa"
            description="Quando você entrar em contato com um vendedor, as mensagens aparecerão aqui."
          />
        ) : (
          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="divide-y divide-border/60 rounded-xl border border-border/60 bg-card"
          >
            {conversations.map((conv) => (
              <motion.li key={conv.id} variants={staggerItem}>
                <Link
                  href={ROUTES.conversa(conv.id)}
                  className="flex items-center gap-3 p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="relative shrink-0">
                    <div className="relative size-14 overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={conv.productImage}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <Avatar
                      src={conv.participantAvatar}
                      fallback={conv.participantName}
                      size="xs"
                      className="absolute -bottom-1 -right-1 ring-2 ring-card"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-medium">{conv.participantName}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatRelativeDate(conv.lastMessageAt)}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{conv.productTitle}</p>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {conv.lastMessage}
                    </p>
                  </div>
                  {conv.unread > 0 && (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {conv.unread}
                    </span>
                  )}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </Container>
    </PageShell>
  )
}
