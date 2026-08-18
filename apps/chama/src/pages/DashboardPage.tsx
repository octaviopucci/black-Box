import { Link } from 'react-router-dom'
import { ArrowUpRight, MessageCircle, Users, Zap } from 'lucide-react'
import { ChannelBadge, StatCard, StatusPill } from '@/components/Ui'
import { formatRelative, pct } from '@/lib/utils'
import { useChama } from '@/store/ChamaContext'

export function DashboardPage() {
  const { state } = useChama()
  const activeContacts = state.contacts.filter((c) => c.status === 'active').length
  const unread = state.conversations.reduce((a, c) => a + c.unread, 0)
  const activeFlows = state.flows.filter((f) => f.status === 'active').length
  const activeAutos = state.automations.filter((a) => a.active).length
  const sent = state.flows.reduce((a, f) => a + f.stats.sent, 0)
  const opened = state.flows.reduce((a, f) => a + f.stats.opened, 0)
  const recent = [...state.conversations].sort(
    (a, b) => +new Date(b.lastMessageAt) - +new Date(a.lastMessageAt),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ember">
            Dashboard
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">
            Olá, {state.user?.name.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-mist">
            {unread > 0
              ? `Você tem ${unread} conversa(s) sem resposta.`
              : 'Inbox em dia. Continue chamando.'}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/app/flows"
            className="rounded-xl bg-flame px-4 py-2.5 text-sm font-bold text-night hover:bg-flameHot"
          >
            Novo flow
          </Link>
          <Link
            to="/app/simulator"
            className="rounded-xl border border-line px-4 py-2.5 text-sm font-semibold text-mist hover:text-paper"
          >
            Simular gatilho
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Contatos ativos" value={activeContacts} hint="na base" accent="text-signal" />
        <StatCard label="Não lidas" value={unread} hint="inbox" accent="text-flame" />
        <StatCard label="Flows ativos" value={activeFlows} hint={`${activeAutos} automações`} />
        <StatCard
          label="Taxa de abertura"
          value={`${pct(opened, sent)}%`}
          hint={`${sent.toLocaleString('pt-BR')} enviadas`}
          accent="text-ember"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="rounded-2xl border border-line bg-abyss/80 lg:col-span-3">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 className="font-display text-lg font-bold">Conversas recentes</h2>
            <Link to="/app/inbox" className="text-xs font-semibold text-ember hover:underline">
              Ver inbox
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {recent.slice(0, 5).map((cv) => {
              const contact = state.contacts.find((c) => c.id === cv.contactId)
              return (
                <li key={cv.id}>
                  <Link
                    to="/app/inbox"
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-slateDeep/50"
                  >
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-slateDeep text-xs font-bold">
                      {contact?.avatar || '?'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold">{contact?.name}</p>
                        <ChannelBadge channel={cv.channel} compact />
                      </div>
                      <p className="truncate text-xs text-mist">{cv.preview}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] text-mist">{formatRelative(cv.lastMessageAt)}</p>
                      {cv.unread ? (
                        <span className="mt-1 inline-flex rounded-full bg-flame px-1.5 text-[10px] font-bold text-night">
                          {cv.unread}
                        </span>
                      ) : null}
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-line bg-abyss/80 p-4">
            <h2 className="font-display text-lg font-bold">Flows em destaque</h2>
            <ul className="mt-3 space-y-3">
              {state.flows.slice(0, 3).map((f) => (
                <li key={f.id} className="rounded-xl border border-line bg-night/50 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{f.name}</p>
                      <p className="text-xs text-mist">{f.trigger}</p>
                    </div>
                    <StatusPill status={f.status} />
                  </div>
                  <p className="mt-2 text-xs text-mist">
                    {f.stats.sent.toLocaleString('pt-BR')} enviadas ·{' '}
                    {pct(f.stats.clicked, f.stats.sent)}% CTR
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { to: '/app/inbox', icon: MessageCircle, label: 'Inbox' },
              { to: '/app/contacts', icon: Users, label: 'Contatos' },
              { to: '/app/automations', icon: Zap, label: 'Autos' },
            ].map((q) => (
              <Link
                key={q.to}
                to={q.to}
                className="rounded-xl border border-line bg-abyss/80 p-3 text-center hover:border-flame/50"
              >
                <q.icon className="mx-auto h-5 w-5 text-flame" />
                <p className="mt-1 text-xs font-semibold">{q.label}</p>
                <ArrowUpRight className="mx-auto mt-1 h-3 w-3 text-mist" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
