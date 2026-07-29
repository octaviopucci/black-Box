import { Link } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center text-porcelain">
      <BrandMark tone="gold" className="mb-6 h-12 w-12" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-gold-soft">404</p>
      <h1 className="mt-4 font-display text-5xl font-semibold">Página fora de afinação</h1>
      <p className="mt-4 max-w-md text-sm text-porcelain/60">
        Esse caminho não existe. Volte à Harmonie e continue a experiência.
      </p>
      <Link to="/" className="cta-gold mt-10">
        Voltar ao início
      </Link>
    </div>
  )
}
