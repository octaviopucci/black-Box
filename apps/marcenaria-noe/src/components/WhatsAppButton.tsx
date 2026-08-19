import { MessageCircle } from 'lucide-react'
import { whatsappHref } from '@/data/site'

export function WhatsAppButton() {
  return (
    <a
      href={whatsappHref()}
      className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center bg-brass text-ink shadow-atelier transition hover:bg-brass-soft md:bottom-8 md:right-8"
      aria-label="Solicitar orçamento pelo WhatsApp"
    >
      <MessageCircle className="size-6" strokeWidth={1.5} />
    </a>
  )
}
