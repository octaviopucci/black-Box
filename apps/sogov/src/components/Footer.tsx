import { site } from '../data/site'

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink px-5 py-12 text-white sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-3xl font-extrabold tracking-tight">{site.brand}</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-white/50">
            Conceito premium de interface para o portal do Governo Federal — demonstração Black Box.
            Não é o site oficial.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-white/55 sm:items-end">
          <a
            href={site.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-brass-soft transition hover:text-white"
          >
            Ver portal oficial →
          </a>
          <p>© {new Date().getFullYear()} Demo conceitual · Black Box</p>
        </div>
      </div>
    </footer>
  )
}
