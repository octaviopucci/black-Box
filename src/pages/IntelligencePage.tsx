import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/Input'
import { intelligenceService } from '@/services/intelligence'
import { formatCurrency, formatPercent } from '@/utils'
import type { PurchaseSimulation } from '@/types'

export function IntelligencePage() {
  const opportunities = useMemo(() => intelligenceService.getOpportunities(), [])
  const capitalParado = useMemo(() => intelligenceService.capitalParado().slice(0, 10), [])

  const [sim, setSim] = useState<PurchaseSimulation>({
    marca: '',
    modelo: '',
    ano: new Date().getFullYear(),
    versao: '',
    precoPedido: 0,
    custoEstimado: 5000,
    precoVendaEstimado: 0,
    prazoEstimado: 30,
  })

  const result = useMemo(() => {
    if (!sim.precoPedido || !sim.precoVendaEstimado) return null
    return intelligenceService.simulatePurchase(sim)
  }, [sim])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Inteligência de Estoque</h1>
        <p className="section-sub">Análise por regras — sem IA paga</p>
      </div>

      <section className="panel p-4">
        <h2 className="mb-4 font-display text-lg font-bold">Oportunidades de compra</h2>
        {opportunities.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {opportunities.map((o) => (
              <div key={o.id} className="rounded-lg border border-lp-line p-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{o.label}</p>
                  <span className="rounded-full bg-lp-accent/10 px-2 py-0.5 text-xs font-bold text-lp-accent">
                    Score {o.score}
                  </span>
                </div>
                <p className="mt-2 text-sm text-lp-steel">{o.recommendation}</p>
                <div className="mt-2 flex gap-4 text-xs text-lp-steel">
                  <span>Vendas: {o.salesShare}%</span>
                  <span>Estoque: {o.stockShare}%</span>
                  <span>Margem média: {o.avgMargin}%</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-lp-steel">Dados insuficientes para oportunidades. Registre vendas recentes.</p>
        )}
      </section>

      <section className="panel p-4">
        <h2 className="mb-4 font-display text-lg font-bold">Simulador de compra</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Input label="Marca" value={sim.marca} onChange={(e) => setSim({ ...sim, marca: e.target.value })} />
          <Input label="Modelo" value={sim.modelo} onChange={(e) => setSim({ ...sim, modelo: e.target.value })} />
          <Input label="Ano" type="number" value={sim.ano} onChange={(e) => setSim({ ...sim, ano: Number(e.target.value) })} />
          <Input label="Preço pedido" type="number" value={sim.precoPedido || ''} onChange={(e) => setSim({ ...sim, precoPedido: Number(e.target.value) })} />
          <Input label="Custos estimados" type="number" value={sim.custoEstimado || ''} onChange={(e) => setSim({ ...sim, custoEstimado: Number(e.target.value) })} />
          <Input label="Preço venda estimado" type="number" value={sim.precoVendaEstimado || ''} onChange={(e) => setSim({ ...sim, precoVendaEstimado: Number(e.target.value) })} />
          <Input label="Prazo estimado (dias)" type="number" value={sim.prazoEstimado} onChange={(e) => setSim({ ...sim, prazoEstimado: Number(e.target.value) })} />
        </div>
        {result ? (
          <div className="mt-4 rounded-lg bg-lp-mist/60 p-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <div><p className="text-xs text-lp-steel">Custo total</p><p className="font-bold">{formatCurrency(result.custoTotal)}</p></div>
              <div><p className="text-xs text-lp-steel">Lucro</p><p className="font-bold">{formatCurrency(result.lucro)}</p></div>
              <div><p className="text-xs text-lp-steel">Margem</p><p className="font-bold">{formatPercent(result.margem)}</p></div>
              <div><p className="text-xs text-lp-steel">Score / Risco</p><p className="font-bold">{result.score} · {result.risco}</p></div>
            </div>
            <ul className="mt-3 list-disc pl-5 text-sm text-lp-steel">
              {result.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="panel p-4">
        <h2 className="mb-4 font-display text-lg font-bold">Capital parado</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Veículo</th>
                <th>Dias</th>
                <th>Custo</th>
                <th>Nível</th>
              </tr>
            </thead>
            <tbody>
              {capitalParado.map((row) => (
                <tr key={row.vehicle.id}>
                  <td>{row.vehicle.marca} {row.vehicle.modelo}</td>
                  <td>{row.days}</td>
                  <td>{formatCurrency(row.custoReal)}</td>
                  <td className="capitalize">{row.nivel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
