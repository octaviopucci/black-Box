import { site } from '@/data/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line px-5 py-10 md:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-brand text-3xl font-semibold text-paper">Noé</p>
          <p className="mt-1 text-sm font-light text-paper/45">
            Marcenaria · móveis sob medida
          </p>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-light text-paper/45">
          <a
            href={site.links.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-brass"
          >
            Instagram
          </a>
          <a
            href={site.links.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-brass"
          >
            Facebook
          </a>
          <a
            href={site.links.linktree}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-brass"
          >
            Linktree
          </a>
        </div>

        <p className="text-xs font-light text-paper/30">
          © {year} {site.name}
        </p>
      </div>
    </footer>
  )
}
