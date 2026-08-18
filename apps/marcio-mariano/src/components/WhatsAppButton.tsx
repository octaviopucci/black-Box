import { MessageCircle } from 'lucide-react'
import { whatsappUrl } from '../data/site'

export function WhatsAppButton() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-40 inline-flex h-14 items-center gap-2 bg-[#25D366] px-4 text-sm font-semibold text-white shadow-lift transition hover:scale-[1.03] sm:bottom-7 sm:right-7"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">Atendimento</span>
    </a>
  )
}
