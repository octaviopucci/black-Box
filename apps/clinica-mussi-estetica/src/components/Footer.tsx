import { site } from '@/data/site'
import { InstagramIcon } from './InstagramIcon'

export function Footer() {
  return (
    <footer className="border-t border-ink/8 px-6 py-10 md:px-10 lg:px-14 xl:px-20">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-3xl tracking-[-0.02em] text-ink">{site.brand.short}</p>
          <p className="mt-2 text-sm text-ink-mute">{site.brand.legal}</p>
          <p className="mt-1 text-xs text-ink-mute">{site.brand.alternate}</p>
        </div>
        <div className="flex flex-col items-start gap-3 md:items-end">
          <a
            href={site.contact.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="touch-link flex items-center gap-2 text-sm text-ink-soft"
          >
            <InstagramIcon className="h-4 w-4" />
            {site.contact.instagramHandle}
          </a>
          <p className="text-xs text-ink-mute">
            Demo Black Box · conteúdo extraído de fontes públicas verificáveis
          </p>
        </div>
      </div>
    </footer>
  )
}
