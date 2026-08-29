import { Link } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center text-paper">
      <BrandMark tone="vida" className="mb-6 h-12 w-12" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-vida-soft">404</p>
      <h1 className="mt-4 font-display text-5xl font-semibold">Página não encontrada</h1>
      <p className="mt-4 max-w-md text-sm text-paper/60">
        Esse caminho não existe. Volte à Clínica Vida e continue.
      </p>
      <Link to="/" className="cta-vida mt-10">
        Voltar ao início
      </Link>
    </div>
  )
}
