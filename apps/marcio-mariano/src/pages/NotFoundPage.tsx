import { Link } from 'react-router-dom'
import { SiteShell } from '../components/SiteShell'

export function NotFoundPage() {
  return (
    <SiteShell solidNav>
      <section className="mx-auto flex min-h-[70vh] w-full max-w-shell flex-col items-start justify-center px-5 py-28 sm:px-8">
        <p className="section-label">Erro 404</p>
        <h1 className="mt-3 font-display text-[clamp(2.4rem,6vw,4rem)] font-semibold tracking-tight text-ink">
          Esta página não existe
        </h1>
        <p className="mt-4 max-w-lg text-base text-mute">
          O endereço pode ter mudado. Volte à página inicial ou explore o portfólio de imóveis.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/" className="btn-blue">
            Ir para o início
          </Link>
          <Link
            to="/imoveis"
            className="inline-flex items-center border border-line bg-snow px-6 py-3.5 text-sm font-semibold text-ink"
          >
            Ver imóveis
          </Link>
        </div>
      </section>
    </SiteShell>
  )
}
