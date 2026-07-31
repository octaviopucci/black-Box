import { MessageCircle } from 'lucide-react'
import { whatsappUrl } from '../data/site'

export function PulseWhatsApp() {
  return (
    <a
      href={whatsappUrl()}
      className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-wine text-cream shadow-lift transition hover:scale-105 hover:bg-wine-soft sm:bottom-8 sm:right-8 sm:h-14 sm:w-14"
      aria-label="Agendar pelo WhatsApp com Dra. Danielle"
      data-cursor
    >
      <span className="absolute inset-0 animate-pulse-ring rounded-full border border-signal/45" />
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}
