import { site } from '@/data/site'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-mar-line bg-mar-paper py-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-4 px-5 text-sm text-mar-ink-soft md:flex-row md:items-center md:justify-between md:px-10">
        <p>
          © {year} {site.name}. Belo Horizonte, MG.
        </p>
        <p className="text-xs uppercase tracking-[0.18em]">
          Conteúdo extraído de {site.source}
        </p>
      </div>
    </footer>
  )
}
