import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-asphalt px-5 text-center">
      <p className="font-brand text-6xl italic text-signal">404</p>
      <h1 className="display-title text-4xl text-chrome-soft">Rota inexistente</h1>
      <p className="max-w-md text-chrome-mute">
        Esse caminho não está no mapa da NA Veículos.
      </p>
      <Link to="/" className="cta-signal">
        Voltar ao início
      </Link>
    </div>
  )
}
