'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Send } from 'lucide-react'

import { Avatar } from '@/components/ui/avatar'
import { IconButton } from '@/components/ui/icon-button'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/constants/brand'
import { formatRelativeDate } from '@/lib/utils'
import { CURRENT_USER_ID } from '@/mocks'
import type { Conversation, Message } from '@/types'

interface ChatDetailProps {
  conversation: Conversation
  initialMessages: Message[]
}

export function ChatDetail({ conversation, initialMessages }: ChatDetailProps) {
  const router = useRouter()
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    const text = draft.trim()
    if (!text) return
    const newMsg: Message = {
      id: `msg-local-${Date.now()}`,
      conversationId: conversation.id,
      senderId: CURRENT_USER_ID,
      text,
      createdAt: new Date().toISOString(),
      read: true,
    }
    setMessages((prev) => [...prev, newMsg])
    setDraft('')
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col md:h-[calc(100dvh-5rem)]">
      {/* Product context header */}
      <header className="flex items-center gap-3 border-b border-border/60 bg-card px-4 py-3">
        <IconButton variant="ghost" aria-label="Voltar" onClick={() => router.push(ROUTES.chat)}>
          <ArrowLeft />
        </IconButton>
        <Link
          href={ROUTES.produto(conversation.productId)}
          className="flex min-w-0 flex-1 items-center gap-3"
        >
          <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-muted">
            <Image
              src={conversation.productImage}
              alt=""
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{conversation.productTitle}</p>
            <p className="truncate text-xs text-muted-foreground">{conversation.participantName}</p>
          </div>
        </Link>
        <Link href={ROUTES.vendedor(conversation.participantId)}>
          <Avatar src={conversation.participantAvatar} fallback={conversation.participantName} size="sm" />
        </Link>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="mx-auto flex max-w-2xl flex-col gap-3">
          {messages.map((msg) => {
            const isMine = msg.senderId === CURRENT_USER_ID
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    isMine
                      ? 'rounded-br-md bg-primary text-primary-foreground'
                      : 'rounded-bl-md bg-muted text-foreground'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p
                    className={`mt-1 text-[10px] ${
                      isMine ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}
                  >
                    {formatRelativeDate(msg.createdAt)}
                  </p>
                </div>
              </motion.div>
            )
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border/60 bg-card p-3 pb-20 md:pb-3">
        <form
          className="mx-auto flex max-w-2xl gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            sendMessage()
          }}
        >
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1"
          />
          <IconButton type="submit" variant="default" aria-label="Enviar mensagem" disabled={!draft.trim()}>
            <Send />
          </IconButton>
        </form>
      </div>
    </div>
  )
}
