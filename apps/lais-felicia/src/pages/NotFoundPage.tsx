import { Link } from 'react-router-dom'
import { BrandMark } from '../components/BrandMark'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-paper px-6 text-center">
      <BrandMark className="h-16 w-16" />
      <p className="font-script text-4xl text-ink">Laís Felicia</p>
      <p className="max-w-md text-ink/55">Essa página não faz parte do studio.</p>
      <Link to="/" className="cta-rose">
        Voltar ao início
      </Link>
    </div>
  )
}
