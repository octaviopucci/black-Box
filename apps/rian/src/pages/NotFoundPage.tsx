import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-ink px-4 text-center text-paper">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">404</p>
      <h1 className="mt-3 font-display text-3xl font-bold">Essa página não existe.</h1>
      <p className="mt-3 max-w-md text-sm text-mist">Volte pro início do funil.</p>
      <Link
        to="/quiz"
        className="mt-8 rounded-xl bg-signal px-5 py-3 font-display text-xs font-semibold uppercase tracking-[0.14em] text-white"
      >
        Ir para o quiz
      </Link>
    </div>
  )
}
