import { Link } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-paper px-6 text-center">
      <BrandMark className="h-20 w-20" />
      <p className="max-w-md text-ink/55">Essa página não faz parte do studio.</p>
      <Link to="/" className="cta-rose">
        Voltar ao início
      </Link>
    </div>
  )
}
