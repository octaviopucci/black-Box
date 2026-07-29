import { GovLogo } from './GovLogo'
import { site } from '../data/site'

export function Footer() {
  return (
    <footer className="bg-gov-darker text-white">
      <div className="flag-stripe h-1.5 w-full" aria-hidden />
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-12 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <GovLogo markClassName="text-white" />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
            Conceito premium do portal de serviços do {site.org}. Demonstração Black Box — não
            substitui o site oficial.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-white/55 sm:items-end">
          <a
            href={site.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-flag-yellow transition hover:text-white"
          >
            Acessar portal oficial →
          </a>
          <p>© {new Date().getFullYear()} Demo conceitual · Black Box</p>
        </div>
      </div>
    </footer>
  )
}
