import { MessageCircle } from 'lucide-react'
import { whatsappUrl } from '../data/site'

export function PulseWhatsApp() {
  return (
    <a
      href={whatsappUrl()}
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white sm:bottom-7 sm:right-7"
      aria-label="Agendar pelo WhatsApp"
    >
      <span
        aria-hidden
        className="absolute inset-0 animate-glow-pulse rounded-full border border-[#25D366]/70"
      />
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}
