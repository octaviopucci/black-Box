import { Link } from 'react-router-dom'
import { SiteNav } from '@/components/brand/SiteNav'
import { SiteFooter } from '@/components/brand/SiteFooter'
import { useProgress } from '@/hooks/useProgress'

const steps = [
  'Respiração guiada (60s)',
  'Lembrete do propósito',
  'Mini-jogo anti-impulso',
  'Mensagem do você do passado',
  'Checklist físico',
  'Afirmação de identidade',
  'Contagem regressiva da onda',
  'Registro do gatilho',
  'Missão do dia liberada',
]

export function ProtocoloPage() {
  const { state, level } = useProgress()

  return (
    <div className="bg-ink text-paper">
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:px-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-signal">
          Ato II · Protocolo PAV
        </p>
        <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold tracking-tight sm:text-5xl">
          Estrutura que substitui o vício por rotina, propósito e identidade.
        </h1>
        <p className="mt-4 max-w-2xl text-mist">
          O PAV tira você da roleta da força de vontade. A Arena vence o minuto. O protocolo vence o
          dia.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Stat label="XP acumulado" value={`${state.xp}`} />
          <Stat label="Nível atual" value={`${level.current.id} · ${level.current.name}`} />
          <Stat label="Ondas vencidas" value={`${state.wavesCleared}`} />
        </div>

        <section className="mt-14">
          <h2 className="font-display text-2xl font-bold">Botão da Fissura · 9 etapas</h2>
          <ol className="mt-6 space-y-3">
            {steps.map((step, i) => (
              <li
                key={step}
                className="flex items-center gap-4 rounded-xl border border-line bg-panel px-4 py-3"
              >
                <span className="font-mono text-sm text-signal">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm text-mist">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-14 rounded-2xl border border-line bg-panel p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold">Jornada BASE</h2>
          <p className="mt-2 max-w-xl text-sm text-ash">
            Dias limpos, streak e missão do dia viram progresso visível. Continue na Arena para
            alimentar o protocolo com XP real.
          </p>
          <div className="mt-6 h-2 overflow-hidden rounded-full bg-steel">
            <div
              className="h-full rounded-full bg-will"
              style={{ width: `${level.pct}%` }}
            />
          </div>
          <p className="mt-2 font-mono text-[11px] text-ash">
            {level.next
              ? `${level.pct}% para ${level.next.name}`
              : 'Nível máximo da demo local'}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/arena"
              className="rounded-xl bg-signal px-5 py-3 font-display text-xs font-semibold uppercase tracking-[0.14em] text-white"
            >
              Voltar à Arena
            </Link>
            <a
              href={`${import.meta.env.BASE_URL}cadastro`.replace(/\/+/g, '/')}
              className="rounded-xl border border-line px-5 py-3 font-display text-xs font-semibold uppercase tracking-[0.14em] text-paper"
            >
              Ativar conta BASE
            </a>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-panel px-5 py-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
    </div>
  )
}
