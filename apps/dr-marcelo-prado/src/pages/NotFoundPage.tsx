import { Link } from 'react-router-dom'
import { site } from '../data/site'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-ink text-snow">
      <Navbar />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-5 py-32 sm:px-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-volt">404</p>
        <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight">
          Sinal não encontrado
        </h1>
        <p className="mt-4 text-snow/55">
          Esta página não existe ou foi movida. Volte ao início para continuar a jornada.
        </p>
        <Link
          to="/"
          className="mt-10 rounded-full bg-wine px-6 py-3 text-sm font-bold text-snow"
        >
          Voltar para {site.name}
        </Link>
      </main>
      <Footer />
    </div>
  )
}
