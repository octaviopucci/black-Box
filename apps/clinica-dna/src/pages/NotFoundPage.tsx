import { Link } from 'react-router-dom'
import { site } from '../data/site'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-abyss px-6 text-center text-snow">
      <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-aqua-soft">404</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
        Página não encontrada
      </h1>
      <p className="mt-4 max-w-md text-sm text-snow/65">
        O caminho que você buscou não existe. Volte à {site.name} e continue sua jornada de cuidado.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-aqua px-6 py-3 text-sm font-semibold text-abyss transition hover:bg-aqua-soft"
      >
        Voltar ao início
      </Link>
    </div>
  )
}
