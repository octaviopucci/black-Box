import { MessageCircle } from 'lucide-react'
import { whatsappHref } from '../data/site'

export function PulseWhatsApp() {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-signal text-chrome-soft shadow-signal transition duration-500 hover:scale-105 hover:bg-signal-soft sm:bottom-8 sm:right-8"
      aria-label="Abrir WhatsApp da NA Veículos"
    >
      <MessageCircle className="h-6 w-6" aria-hidden />
      <span className="absolute inset-0 animate-speed-pulse rounded-full border border-signal/60" aria-hidden />
    </a>
  )
}
