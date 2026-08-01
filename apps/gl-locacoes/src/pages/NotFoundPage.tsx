import { Link } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-navy px-6 text-center">
      <BrandMark className="h-20 w-20" />
      <p className="font-brand text-4xl font-bold text-paper">G&amp;L Locações</p>
      <p className="max-w-md text-paper/65">Essa página não faz parte da festa.</p>
      <Link to="/" className="cta-sun">
        Voltar ao início
      </Link>
    </div>
  )
}
