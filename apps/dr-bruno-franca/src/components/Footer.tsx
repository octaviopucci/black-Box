import { site } from '@/data/site'
import { InstagramIcon } from '@/components/InstagramIcon'

export function Footer() {
  return (
    <footer className="border-t border-line px-5 py-10 md:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <p className="font-brand text-lg text-paper">{site.name}</p>
          <p className="mt-1 text-sm text-paper/45">{site.tagline}</p>
        </div>
        <a
          href={site.links.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-paper/55 transition hover:text-enamel-soft"
        >
          <InstagramIcon className="h-4 w-4" />
          @{site.handle}
        </a>
      </div>
    </footer>
  )
}
