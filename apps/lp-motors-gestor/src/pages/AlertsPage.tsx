import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SeverityBadge } from '@/components/common/StatusBadge'
import { EmptyState } from '@/components/ui/Feedback'
import { useApp } from '@/context/AppContext'
import type { AlertCategory, AlertSeverity } from '@/types'

const CATEGORY_LABELS: Record<AlertCategory, string> = {
  documentacao: 'Documentação',
  estoque: 'Estoque',
  financeiro: 'Financeiro',
  operacional: 'Operacional',
}

export function AlertsPage() {
  const { alerts } = useApp()
  const [category, setCategory] = useState<AlertCategory | ''>('')
  const [severity, setSeverity] = useState<AlertSeverity | ''>('')

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (category && a.category !== category) return false
      if (severity && a.severity !== severity) return false
      return true
    })
  }, [alerts, category, severity])

  const grouped = useMemo(() => {
    const map = new Map<AlertCategory, typeof filtered>()
    for (const a of filtered) {
      const list = map.get(a.category) || []
      list.push(a)
      map.set(a.category, list)
    }
    return map
  }, [filtered])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title">Central de Alertas</h1>
        <p className="section-sub">{filtered.length} alerta(s) — regras baseadas no estoque e operação</p>
      </div>

      <div className="panel flex flex-wrap gap-3 p-4">
        <select
          className="input-field w-auto min-w-[140px]"
          value={category}
          onChange={(e) => setCategory(e.target.value as AlertCategory | '')}
        >
          <option value="">Todas categorias</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <select
          className="input-field w-auto min-w-[140px]"
          value={severity}
          onChange={(e) => setSeverity(e.target.value as AlertSeverity | '')}
        >
          <option value="">Todas severidades</option>
          <option value="critico">Crítico</option>
          <option value="atencao">Atenção</option>
          <option value="info">Info</option>
          <option value="oportunidade">Oportunidade</option>
        </select>
      </div>

      {!filtered.length ? (
        <EmptyState title="Nenhum alerta" description="Tudo em ordem no momento." />
      ) : (
        <div className="space-y-6">
          {Array.from(grouped.entries()).map(([cat, items]) => (
            <section key={cat} className="panel p-4">
              <h2 className="mb-3 font-display text-lg font-bold">{CATEGORY_LABELS[cat]}</h2>
              <ul className="space-y-2">
                {items.map((a) => (
                  <li key={a.id} className="rounded-lg border border-lp-line px-4 py-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{a.title}</p>
                        <p className="text-sm text-lp-steel">{a.message}</p>
                        {a.recommendation ? (
                          <p className="mt-1 text-xs text-lp-accent">{a.recommendation}</p>
                        ) : null}
                      </div>
                      <SeverityBadge severity={a.severity} />
                    </div>
                    {a.vehicleId ? (
                      <Link to={`/veiculos/${a.vehicleId}`} className="mt-2 inline-block text-sm font-semibold text-lp-accent">
                        Ver veículo →
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
