import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { OrbitNav } from '../components/OrbitNav'
import { Closing } from '../components/Closing'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-void text-paper">
      <OrbitNav />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-5 py-32 sm:px-8 md:pl-28">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-signal">404</p>
        <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight">
          Sinal não encontrado
        </h1>
        <p className="mt-4 text-paper/55">Esta página não existe. Volte ao início da calibração.</p>
        <Link
          to="/"
          className="mt-10 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-void"
        >
          Voltar para {site.name}
        </Link>
      </main>
      <Closing />
    </div>
  )
}
