import { site } from '@/data/site'
import { InstagramIcon } from '@/components/InstagramIcon'

export function InstagramButton() {
  return (
    <a
      href={site.links.instagram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram @drbrunofranca_"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center bg-enamel text-ink shadow-clinic transition duration-500 hover:bg-enamel-soft md:bottom-8 md:right-8"
    >
      <InstagramIcon className="h-5 w-5" />
    </a>
  )
}
