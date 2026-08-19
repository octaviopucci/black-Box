import { Link } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-night px-6 text-center">
      <BrandMark className="h-20 w-20" />
      <p className="max-w-md text-ink-mute">Essa página não faz parte do studio.</p>
      <Link to="/" className="cta-gold">
        Voltar ao início
      </Link>
    </div>
  )
}
