import { MessageCircle } from 'lucide-react'
import { whatsappUrl } from '../data/site'

export function PulseWhatsApp() {
  return (
    <a
      href={whatsappUrl()}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-fern text-porcelain shadow-lift transition hover:scale-105 hover:bg-fern-soft sm:bottom-8 sm:right-8"
      aria-label="Agendar pelo WhatsApp"
      data-cursor
    >
      <span className="absolute inset-0 animate-pulse-ring rounded-full border border-fern/40" />
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}
