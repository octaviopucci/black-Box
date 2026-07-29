import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar solid />
      <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-start justify-center px-5 pt-24 sm:px-8">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">404</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
          Imóvel não encontrado
        </h1>
        <p className="mt-4 text-mute">
          Esse endereço não existe no catálogo atual da Porthal. Volte para a seleção de imóveis.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-deep"
        >
          Ir para o início
        </Link>
      </main>
      <Footer />
    </div>
  )
}
