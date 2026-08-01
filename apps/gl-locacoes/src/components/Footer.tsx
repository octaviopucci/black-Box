import { site } from '../data/site'
import { BrandMark } from './BrandMark'

export function Footer() {
  return (
    <footer className="border-t border-line px-5 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <BrandMark className="h-14 w-14" showWordmark />
          <p className="mt-4 max-w-sm text-sm text-paper/55">
            {site.fullName} · {site.city}
          </p>
          <p className="mt-2 text-sm font-semibold uppercase tracking-[0.2em] text-sun">
            {site.slogan}
          </p>
        </div>
        <div className="text-sm text-paper/50">
          <p>
            <a href={site.phones[0].href} className="hover:text-sun">
              {site.phones[0].label}
            </a>
            {' · '}
            <a href={site.phones[1].href} className="hover:text-sun">
              {site.phones[1].label}
            </a>
          </p>
          <p className="mt-2">
            <a href={site.instagram} target="_blank" rel="noreferrer" className="hover:text-sun">
              {site.instagramHandle}
            </a>
          </p>
          <p className="mt-4 text-xs text-paper/35">Demo Black Box · {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  )
}
