import { InstagramIcon } from '@/components/InstagramIcon'
import { site } from '@/data/site'

export function Footer() {
  return (
    <footer className="border-t border-paper-deep bg-paper px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-3xl text-ink">{site.brand.short}</p>
          <p className="mt-2 max-w-md font-sans text-sm leading-relaxed text-ink-mute">{site.brand.legal}</p>
        </div>

        <a
          href={site.contact.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-sans text-sm font-semibold text-copper transition-colors hover:text-copper-deep"
        >
          <InstagramIcon className="h-4 w-4" />
          {site.contact.instagramHandle}
        </a>
      </div>
    </footer>
  )
}
