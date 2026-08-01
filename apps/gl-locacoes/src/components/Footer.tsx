import { site } from '../data/site'

export function Footer() {
  return (
    <footer className="border-t border-line px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-brand text-2xl font-extrabold tracking-tight">
            G&amp;L <span className="text-sun">Fest</span>
          </p>
          <p className="mt-2 text-sm text-paper/55">
            {site.fullName} · {site.city} · desde {site.years}
          </p>
        </div>
        <p className="text-xs text-paper/40">
          Demo Black Box · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  )
}
