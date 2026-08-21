import { InstagramIcon } from '@/components/InstagramIcon'
import { instagramUrl } from '@/data/site'

export function PulseInstagram() {
  return (
    <a
      href={instagramUrl('Olá! Gostaria de agendar uma avaliação na OdontoMed.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agendar avaliação pelo Instagram"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-copper text-paper shadow-[0_12px_40px_rgba(90,63,72,0.35)] transition-transform duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper lg:hidden"
    >
      <InstagramIcon className="h-6 w-6" />
    </a>
  )
}
