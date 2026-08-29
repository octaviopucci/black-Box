import { Link } from 'react-router-dom'
import { Button } from '@/components/Button'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-24 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-green">404</p>
      <h1 className="mt-4 font-display text-4xl font-black text-green-deep">Página não encontrada</h1>
      <p className="mt-4 max-w-md text-graphite/70">O conteúdo que você procura não existe ou foi movido.</p>
      <div className="mt-8 flex gap-4">
        <Button to="/" variant="primary">
          Voltar ao início
        </Button>
        <Link to="/conteudos" className="inline-flex items-center font-bold text-green hover:text-green-dark">
          Ver conteúdos
        </Link>
      </div>
    </div>
  )
}
