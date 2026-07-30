import { Link } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-wine-deep px-6 text-center text-cream">
      <BrandMark tone="rose" className="mb-6 h-12 w-12" />
      <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-rose-soft">404</p>
      <h1 className="mt-4 font-display text-5xl font-semibold">Página fora da versão</h1>
      <p className="mt-4 max-w-md text-sm text-cream/60">
        Esse caminho não existe. Volte à Matsubara e continue a experiência.
      </p>
      <Link to="/" className="cta-wine mt-10 bg-rose text-ink hover:bg-rose-soft">
        Voltar ao início
      </Link>
    </div>
  )
}
