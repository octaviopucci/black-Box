import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-chalk">
      <Navbar solid />
      <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-start justify-center px-5 py-28 sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand">404</p>
        <h1 className="mt-3 font-display text-5xl font-semibold text-navy sm:text-6xl">
          Página não encontrada
        </h1>
        <p className="mt-4 max-w-md text-mute">
          O endereço pode ter mudado. Volte ao início e continue explorando os imóveis.
        </p>
        <Link
          to="/"
          className="mt-8 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand"
        >
          Ir para o início
        </Link>
      </main>
      <Footer />
    </div>
  )
}
