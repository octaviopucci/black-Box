import { site } from '@/data/site'

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper px-5 py-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-lg text-ink">
            {site.name} · {site.title}
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-mute" aria-label="Rodapé">
          {site.nav.map((item) => (
            <a key={item.href} href={item.href} className="transition hover:text-accent">
              {item.label}
            </a>
          ))}
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-accent"
          >
            Instagram
          </a>
        </nav>
      </div>
    </footer>
  )
}
