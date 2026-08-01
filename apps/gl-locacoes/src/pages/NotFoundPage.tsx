import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-night px-6 text-center">
      <p className="font-brand text-5xl font-extrabold text-sun">G&amp;L Fest</p>
      <p className="max-w-md text-paper/70">Essa página não faz parte da festa.</p>
      <Link to="/" className="cta-sun">
        Voltar ao início
      </Link>
    </div>
  )
}
