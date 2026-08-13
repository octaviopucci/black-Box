import type { Channel } from '@/types'
import { CHANNEL_COLOR, CHANNEL_LABEL } from '@/lib/utils'

export function ChannelBadge({ channel, compact }: { channel: Channel; compact?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
      style={{
        background: `${CHANNEL_COLOR[channel]}22`,
        color: CHANNEL_COLOR[channel],
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: CHANNEL_COLOR[channel] }}
      />
      {compact ? channel.slice(0, 2).toUpperCase() : CHANNEL_LABEL[channel]}
    </span>
  )
}

export function StatusPill({
  status,
}: {
  status: string
}) {
  const map: Record<string, string> = {
    active: 'bg-signal/15 text-signal',
    open: 'bg-signal/15 text-signal',
    sent: 'bg-signal/15 text-signal',
    connected: 'bg-signal/15 text-signal',
    draft: 'bg-mist/15 text-mist',
    paused: 'bg-ember/15 text-ember',
    pending: 'bg-ember/15 text-ember',
    scheduled: 'bg-sky/15 text-sky',
    sending: 'bg-sky/15 text-sky',
    closed: 'bg-mist/15 text-mist',
    blocked: 'bg-flame/15 text-flame',
    unsubscribed: 'bg-flame/15 text-flame',
  }
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${map[status] || 'bg-line text-mist'}`}
    >
      {status}
    </span>
  )
}

export function Avatar({
  label,
  size = 'md',
}: {
  label: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const s = size === 'lg' ? 'h-12 w-12 text-base' : size === 'sm' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm'
  return (
    <div
      className={`${s} grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-slateDeep to-line font-bold text-paper ring-1 ring-line`}
    >
      {label.slice(0, 2).toUpperCase()}
    </div>
  )
}

export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string
  value: string | number
  hint?: string
  accent?: string
}) {
  return (
    <div className="rounded-2xl border border-line bg-abyss/80 p-4 shadow-soft backdrop-blur">
      <p className="text-xs font-medium uppercase tracking-wider text-mist">{label}</p>
      <p className={`mt-2 font-display text-3xl font-bold ${accent || 'text-paper'}`}>{value}</p>
      {hint ? <p className="mt-1 text-xs text-mist">{hint}</p> : null}
    </div>
  )
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: import('react').ReactNode
}) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-line bg-abyss/40 px-6 py-16 text-center">
      <h3 className="font-display text-xl font-bold text-paper">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-mist">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}
