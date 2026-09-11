import { useEffect, useState } from 'react'
import { Cloud, CloudOff, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { getSyncState, onSyncStateChange, cloudSync } from '@/services/sync'
import { isDirty } from '@/services/database'

export function SyncStatus() {
  const [state, setState] = useState(getSyncState())

  useEffect(() => onSyncStateChange((s, m) => setState({ state: s, message: m })), [])

  const icons = {
    idle: Cloud,
    syncing: Loader2,
    synced: CheckCircle2,
    error: AlertCircle,
    offline: CloudOff,
  }
  const Icon = icons[state.state]
  const spinning = state.state === 'syncing'

  const colors = {
    idle: 'text-brand-muted',
    syncing: 'text-brand-neon-cyan',
    synced: 'text-emerald-400',
    error: 'text-red-400',
    offline: 'text-amber-400',
  }

  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <Icon className={`h-3.5 w-3.5 shrink-0 ${colors[state.state]} ${spinning ? 'animate-spin' : ''}`} />
      <div className="min-w-0 flex-1">
        <p className={`text-[10px] font-semibold uppercase tracking-wide ${colors[state.state]}`}>
          {state.state === 'syncing' && 'Sincronizando'}
          {state.state === 'synced' && 'Sincronizado'}
          {state.state === 'error' && 'Erro de sync'}
          {state.state === 'offline' && 'Somente local'}
          {state.state === 'idle' && (isDirty() ? 'Pendente' : 'Pronto')}
        </p>
        {state.message && (
          <p className="truncate text-[10px] text-brand-muted">{state.message}</p>
        )}
      </div>
      {(state.state === 'error' || state.state === 'offline' || isDirty()) && (
        <button
          type="button"
          onClick={() => void cloudSync.push()}
          className="shrink-0 rounded border border-brand-border px-2 py-0.5 text-[10px] font-bold text-brand-glow hover:bg-white/5"
        >
          Enviar
        </button>
      )}
    </div>
  )
}
