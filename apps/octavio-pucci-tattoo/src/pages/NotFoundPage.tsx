import { Link } from 'react-router-dom'
import { site, whatsappUrl } from '../data/site'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-obsidian px-6 text-center text-parchment">
      <p className="section-label mb-4">404</p>
      <h1 className="font-brand text-6xl tracking-[0.1em]">PERDIDO</h1>
      <p className="mt-4 max-w-sm text-sm text-parchment/60">
        Esta página não existe. Volte ao studio.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <Link to="/" className="cta-primary justify-center">
          Início
        </Link>
        <a href={whatsappUrl()} className="cta-ghost justify-center">
          WhatsApp
        </a>
      </div>
      <p className="mt-12 text-[10px] uppercase tracking-[0.3em] text-parchment/30">
        {site.brand}
      </p>
    </div>
  )
}
