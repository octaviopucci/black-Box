import { ChannelBadge, StatCard } from '@/components/Ui'
import { pct } from '@/lib/utils'
import { useChama } from '@/store/ChamaContext'

export function AnalyticsPage() {
  const { state } = useChama()
  const sent = state.flows.reduce((a, f) => a + f.stats.sent, 0)
  const opened = state.flows.reduce((a, f) => a + f.stats.opened, 0)
  const clicked = state.flows.reduce((a, f) => a + f.stats.clicked, 0)
  const matches = state.automations.reduce((a, x) => a + x.matches, 0)
  const byChannel = state.channels
    .filter((c) => c.connected)
    .map((c) => {
      const flowStats = state.flows
        .filter((f) => f.channel === c.channel)
        .reduce((a, f) => a + f.stats.sent, 0)
      return { channel: c.channel, sent: flowStats, followers: c.followers || 0 }
    })

  const maxSent = Math.max(...state.flows.map((f) => f.stats.sent), 1)

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">Analytics</p>
        <h1 className="font-display text-3xl font-bold">Performance</h1>
        <p className="text-sm text-mist">Métricas dos flows, automações e canais</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Mensagens enviadas" value={sent.toLocaleString('pt-BR')} />
        <StatCard label="Abertura" value={`${pct(opened, sent)}%`} accent="text-ember" />
        <StatCard label="CTR" value={`${pct(clicked, sent)}%`} accent="text-signal" />
        <StatCard label="Matches de gatilho" value={matches.toLocaleString('pt-BR')} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-abyss/80 p-4">
          <h2 className="font-display text-lg font-bold">Flows por volume</h2>
          <ul className="mt-4 space-y-3">
            {state.flows.map((f) => (
              <li key={f.id}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{f.name}</span>
                  <span className="text-mist">{f.stats.sent.toLocaleString('pt-BR')}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-flame to-ember"
                    style={{ width: `${(f.stats.sent / maxSent) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-line bg-abyss/80 p-4">
          <h2 className="font-display text-lg font-bold">Canais conectados</h2>
          <ul className="mt-4 space-y-3">
            {byChannel.map((c) => (
              <li
                key={c.channel}
                className="flex items-center justify-between rounded-xl border border-line bg-night/40 px-3 py-3"
              >
                <ChannelBadge channel={c.channel} />
                <div className="text-right text-xs text-mist">
                  <p>{c.sent.toLocaleString('pt-BR')} msgs</p>
                  <p>{c.followers.toLocaleString('pt-BR')} seguidores</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
