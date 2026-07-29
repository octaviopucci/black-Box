import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-void px-6 text-center text-paper">
      <p className="text-[11px] uppercase tracking-[0.38em] text-signal/70">404</p>
      <h1 className="mt-4 font-display text-5xl font-semibold tracking-tight">
        Este fio se perdeu
      </h1>
      <p className="mt-4 max-w-sm text-sm text-mute">
        Volte ao início e continue a narrativa da Clínica DNA.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-void"
      >
        Voltar
      </Link>
    </div>
  )
}
