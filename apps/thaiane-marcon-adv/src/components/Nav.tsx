import { site } from '@/data/site'

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <a
          href="#topo"
          className="font-display text-sm font-medium tracking-[0.18em] text-white uppercase"
        >
          {site.name}
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[0.72rem] font-medium tracking-mark text-white/85 uppercase transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href={site.cta.href}
          target="_blank"
          rel="noreferrer"
          className="rounded-full border border-white/35 px-4 py-2 text-[0.72rem] font-semibold tracking-mark text-white uppercase transition hover:bg-white hover:text-ink"
        >
          Contato
        </a>
      </div>
    </header>
  )
}
