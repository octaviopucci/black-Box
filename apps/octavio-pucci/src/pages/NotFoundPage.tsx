import { Link } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-void px-6 text-center text-bone">
      <BrandMark className="h-12 w-12" />
      <h1 className="mt-8 font-brand text-6xl tracking-[0.12em]">404</h1>
      <p className="mt-4 max-w-md font-display text-2xl italic text-bone/70">
        Essa marca ainda não existe neste mapa.
      </p>
      <Link to="/" className="cta-gold mt-10">
        Voltar ao início
      </Link>
    </div>
  )
}
