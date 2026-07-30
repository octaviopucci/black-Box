import { MessageCircle } from 'lucide-react'
import { whatsappHref } from '../data/site'

export function PulseWhatsApp() {
  return (
    <a
      href={whatsappHref()}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-lamp text-ink shadow-lamp transition duration-500 hover:scale-105 hover:bg-lamp-soft sm:bottom-8 sm:right-8"
      aria-label="Abrir WhatsApp da NA Veículos"
      data-cursor="WhatsApp"
    >
      <MessageCircle className="h-6 w-6" aria-hidden />
    </a>
  )
}
