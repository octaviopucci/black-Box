import { Link } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-wine-deep px-6 text-center text-cream">
      <BrandMark tone="rose" className="mb-6 h-12 w-12" />
      <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-rose-soft">404</p>
      <h1 className="mt-4 font-display text-5xl font-semibold">Página fora da escuta</h1>
      <p className="mt-4 max-w-md text-sm text-cream/60">
        Esse caminho não existe. Volte ao início e continue a experiência com a Dra. Danielle.
      </p>
      <Link to="/" className="cta-signal mt-10">
        Voltar ao início
      </Link>
    </div>
  )
}
