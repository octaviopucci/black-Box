import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-void text-snow">
      <Navbar />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-5 py-32 sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-signal">404</p>
        <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight">
          Sinal não encontrado
        </h1>
        <p className="mt-4 text-snow/60">
          Esta página não existe ou foi movida. Volte ao início para continuar a jornada.
        </p>
        <Link
          to="/"
          className="mt-10 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-void"
        >
          Voltar para {site.name}
        </Link>
      </main>
      <Footer />
    </div>
  )
}
