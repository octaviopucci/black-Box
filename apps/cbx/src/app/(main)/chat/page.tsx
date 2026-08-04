'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, MessageCircle, Play } from 'lucide-react'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { ROUTES } from '@/constants/brand'
import { formatRelativeDate } from '@/lib/utils'
import { chatService } from '@/services'
import { useAdGate } from '@/hooks/use-ad-gate'
import { staggerContainer, staggerItem } from '@/animations/variants'

export default function ChatPage() {
  const conversations = chatService.conversations()
  const { runWithAd, isUnlocked, isAdFree } = useAdGate()
  const router = useRouter()
  const [ready, setReady] = useState(isAdFree || isUnlocked('chat'))

  useEffect(() => {
    if (isAdFree || isUnlocked('chat')) setReady(true)
  }, [isAdFree, isUnlocked])

  const unlock = () => {
    runWithAd('chat', () => setReady(true))
  }

  if (!ready) {
    return (
      <PageShell>
        <Container className="py-10">
          <div className="mx-auto max-w-md rounded-2xl border border-border/60 bg-card p-8 text-center shadow-sm">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Lock className="size-6" aria-hidden />
            </div>
            <h1 className="mt-4 text-xl font-bold tracking-tight">Chat bloqueado</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              No plano gratuito, assista a um anúncio em vídeo para liberar suas conversas — ou
              faça upgrade para Premium sem anúncios.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Button onClick={unlock}>
                <Play className="size-4" />
                Assistir e liberar chat
              </Button>
              <Button variant="outline" onClick={() => router.push(ROUTES.planos)}>
                Conhecer planos
              </Button>
            </div>
          </div>
        </Container>
      </PageShell>
    )
  }

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
