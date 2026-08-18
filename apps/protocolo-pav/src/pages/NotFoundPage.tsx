import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-ink px-4 text-center text-paper">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">404 · rota perdida</p>
      <h1 className="mt-3 font-display text-4xl font-bold">Esse caminho não existe na BASE.</h1>
      <p className="mt-3 max-w-md text-mist">Volte para a Arena ou para o início do protocolo.</p>
      <div className="mt-8 flex gap-3">
        <Link
          to="/"
          className="rounded-xl border border-line px-5 py-3 font-display text-xs font-semibold uppercase tracking-[0.14em]"
        >
          Home
        </Link>
        <Link
          to="/arena"
          className="rounded-xl bg-signal px-5 py-3 font-display text-xs font-semibold uppercase tracking-[0.14em] text-white"
        >
          Arena
        </Link>
      </div>
    </div>
  )
}
