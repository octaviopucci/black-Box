import { notFound } from 'next/navigation'

import { chatService } from '@/services'
import { ChatDetail } from './chat-detail'

export function generateStaticParams() {
  return chatService.conversations().map((conv) => ({ id: conv.id }))
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ChatConversationPage({ params }: PageProps) {
  const { id } = await params
  const conversation = chatService.conversation(id)

  if (!conversation) notFound()

  const messages = chatService.messages(id)

  return <ChatDetail conversation={conversation} initialMessages={messages} />
}
