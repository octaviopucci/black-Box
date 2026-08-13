import { useChama } from '@/store/ChamaContext'

export function SettingsPage() {
  const { state, resetDemo, logout } = useChama()

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">
          Configurações
        </p>
        <h1 className="font-display text-3xl font-bold">Conta</h1>
      </div>

      <div className="rounded-2xl border border-line bg-abyss/80 p-5">
        <h2 className="font-display text-lg font-bold">Perfil</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-line pb-2">
            <dt className="text-mist">Nome</dt>
            <dd className="font-semibold">{state.user?.name}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-line pb-2">
            <dt className="text-mist">E-mail</dt>
            <dd className="font-semibold">{state.user?.email}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-line pb-2">
            <dt className="text-mist">Empresa</dt>
            <dd className="font-semibold">{state.user?.company}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-mist">Plano</dt>
            <dd className="font-semibold uppercase text-ember">{state.user?.plan}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-line bg-abyss/80 p-5">
        <h2 className="font-display text-lg font-bold">Dados da demo</h2>
        <p className="mt-2 text-sm text-mist">
          O chama salva tudo no localStorage deste navegador. Você pode resetar
          para o estado inicial com seed data.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetDemo}
            className="rounded-xl bg-flame px-4 py-2.5 text-sm font-bold text-night hover:bg-flameHot"
          >
            Resetar demo
          </button>
          <button
            type="button"
            onClick={logout}
            className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-mist hover:text-paper"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}
