import { Link } from 'react-router-dom'
import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { WhatsAppButton } from '../components/WhatsAppButton'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-paper">
      <Navbar solid />
      <main className="container-page flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 font-display text-5xl tracking-tight text-ink sm:text-6xl">
          Imóvel não encontrado
        </h1>
        <p className="mt-4 max-w-md text-mute">
          Esse endereço pode ter sido removido ou o link está incompleto. Explore o catálogo
          completo da Porthal.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="btn-primary">
            Ir ao início
          </Link>
          <Link
            to="/imoveis"
            className="inline-flex items-center justify-center border border-ink/15 px-7 py-3.5 text-sm font-semibold transition hover:border-brand hover:text-brand"
          >
            Ver catálogo
          </Link>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
