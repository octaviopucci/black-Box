import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink px-5 text-center">
      <p className="font-display text-6xl font-bold text-lamp">404</p>
      <h1 className="display text-4xl text-paper-soft">Página não encontrada</h1>
      <p className="max-w-md text-paper-mute">
        Esse endereço não existe no site da NA Veículos.
      </p>
      <Link to="/" className="cta-lamp">
        Voltar ao início
      </Link>
    </div>
  )
}
