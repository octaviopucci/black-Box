import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Archive,
  Copy,
  Pencil,
  Printer,
  RotateCcw,
  ShoppingCart,
  Trash2,
} from 'lucide-react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Timeline } from '@/components/common/Timeline'
import { PhotoGallery } from '@/components/vehicles/PhotoGallery'
import { ExpenseForm } from '@/components/finance/ExpenseForm'
import { SaleForm } from '@/components/finance/SaleForm'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog, Modal } from '@/components/ui/Modal'
import { EmptyState, Loading } from '@/components/ui/Feedback'
import { useApp } from '@/context/AppContext'
import { saleService } from '@/services/sales'
import { checklistService } from '@/services/expenses'
import {
  EXPENSE_LABELS,
  FUEL_LABELS,
  PAYMENT_LABELS,
  STATUS_LABELS,
  TRANSMISSION_LABELS,
} from '@/utils/constants'
import {
  daysBetween,
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
  printElement,
} from '@/utils'
import {
  calcRealCost,
  calcPotentialProfit,
  calcSaleMetrics,
  calcVehicleScore,
  stockAgeDays,
  sumExpenses,
  defaultOrgSettings,
} from '@/utils/finance'
import type { VehicleStatus } from '@/types'
import { Select } from '@/components/ui/Input'
import { APP_NAME } from '@/config/variant'
import { cn } from '@/utils'

const TABS = [
  { id: 'visao', label: 'Visão geral' },
  { id: 'compra', label: 'Compra' },
  { id: 'custos', label: 'Custos' },
  { id: 'documentos', label: 'Documentos' },
  { id: 'preparacao', label: 'Preparação' },
  { id: 'historico', label: 'Histórico' },
  { id: 'financeiro', label: 'Financeiro' },
  { id: 'venda', label: 'Venda' },
] as const

type TabId = (typeof TABS)[number]['id']

export function VehicleDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    vehicles,
    expenses,
    customers,
    history,
    documents,
    settings,
    ready,
    deleteVehicle,
    duplicateVehicle,
    archiveVehicle,
    restoreVehicle,
    createExpense,
    updateExpense,
    deleteExpense,
    createSale,
    updateVehicle,
    toggleChecklist,
  } = useApp()

  const [tab, setTab] = useState<TabId>('visao')
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [saleOpen, setSaleOpen] = useState(false)
  const [expenseOpen, setExpenseOpen] = useState(false)
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null)

  const vehicle = vehicles.find((v) => v.id === id)
  const vehicleExpenses = useMemo(
    () => expenses.filter((e) => e.vehicleId === id).sort((a, b) => b.data.localeCompare(a.data)),
    [expenses, id],
  )
  const vehicleDocs = useMemo(
    () => documents.filter((d) => d.vehicleId === id),
    [documents, id],
  )
  const sale = useMemo(
    () => (id ? saleService.getByVehicle(id) : undefined),
    [id, vehicles, expenses],
  )
  const events = useMemo(
    () => history.filter((h) => h.vehicleId === id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [history, id],
  )
  const checklist = useMemo(() => (id ? checklistService.get(id) : null), [id, vehicles])

  if (!ready) return <Loading />
  if (!vehicle) return <EmptyState title="Veículo não encontrado" />

  const custoReal = calcRealCost(vehicle, vehicleExpenses)
  const lucroPotencial = calcPotentialProfit(vehicle, vehicleExpenses)
  const dias = stockAgeDays(vehicle)
  const margin = vehicle.precoAnunciado
    ? ((vehicle.precoAnunciado - custoReal) / vehicle.precoAnunciado) * 100
    : 0

  const chkDone = checklist ? checklist.items.filter((i) => i.done).length / checklist.items.length : 0
  const docsOk = vehicleDocs.length
    ? vehicleDocs.filter((d) => d.status === 'regular').length / vehicleDocs.length
    : 0.5
  const score = calcVehicleScore(
    vehicle,
    vehicleExpenses,
    chkDone,
    docsOk,
    settings.org || defaultOrgSettings(),
  )

  const metrics = calcSaleMetrics(
    vehicle,
    vehicleExpenses,
    sale?.valorVendido || vehicle.precoAnunciado || 0,
    sale?.comissao || 0,
    sale?.dataVenda || new Date().toISOString(),
  )

  const printFicha = () => {
    printElement(
      `Ficha ${vehicle.marca} ${vehicle.modelo}`,
      `<h1>${APP_NAME} — Ficha do Veículo</h1>
      <p class="meta">${vehicle.marca} ${vehicle.modelo} ${vehicle.versao}</p>
      <table>
        <tr><th>Placa</th><td>${vehicle.placa || '—'}</td><th>Status</th><td>${STATUS_LABELS[vehicle.status]}</td></tr>
        <tr><th>Custo real</th><td>${formatCurrency(custoReal)}</td><th>Margem est.</th><td>${formatPercent(margin)}</td></tr>
        <tr><th>Dias estoque</th><td>${dias}</td><th>Score</th><td>${score.total}/100</td></tr>
      </table>`,
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="section-title">
              {vehicle.marca} {vehicle.modelo}
            </h1>
            <StatusBadge status={vehicle.status} />
            {vehicle.draft ? (
              <span className="chip border border-amber-200 bg-amber-50 text-amber-800">Rascunho</span>
            ) : null}
          </div>
          <p className="section-sub">
            {vehicle.versao} · {vehicle.ano}/{vehicle.anoModelo} · {vehicle.placa || vehicle.codigoInterno}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/veiculos/${vehicle.id}/editar`}>
            <Button variant="secondary" size="sm">
              <Pencil className="h-4 w-4" />
              Editar
            </Button>
          </Link>
          <Button variant="secondary" size="sm" onClick={printFicha}>
            <Printer className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="sm" onClick={() => duplicateVehicle(vehicle.id)}>
            <Copy className="h-4 w-4" />
          </Button>
          {vehicle.archived ? (
            <Button variant="secondary" size="sm" onClick={() => restoreVehicle(vehicle.id)}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={() => archiveVehicle(vehicle.id)}>
              <Archive className="h-4 w-4" />
            </Button>
          )}
          <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-4 w-4" />
          </Button>
          {!sale ? (
            <Button size="sm" onClick={() => setSaleOpen(true)}>
              <ShoppingCart className="h-4 w-4" />
              Registrar venda
            </Button>
          ) : null}
        </div>
      </div>

      {/* Score + KPIs */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="kpi">
          <p className="kpi-label">Score</p>
          <p className="kpi-value text-lp-accent">{score.total}</p>
        </div>
        <div className="kpi">
          <p className="kpi-label">Custo real</p>
          <p className="kpi-value">{formatCurrency(custoReal)}</p>
        </div>
        <div className="kpi">
          <p className="kpi-label">Margem est.</p>
          <p className="kpi-value">{formatPercent(margin)}</p>
        </div>
        <div className="kpi">
          <p className="kpi-label">Dias estoque</p>
          <p className="kpi-value">{dias}d</p>
        </div>
        <div className="kpi">
          <p className="kpi-label">Lucro potencial</p>
          <p className="kpi-value text-lp-ok">{formatCurrency(lucroPotencial)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-lp-line pb-px">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              'whitespace-nowrap rounded-t-lg px-4 py-2 text-sm font-semibold transition',
              tab === t.id
                ? 'border border-b-0 border-lp-line bg-white text-lp-accent'
                : 'text-lp-steel hover:text-lp-ink',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'visao' ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="panel p-4">
            <PhotoGallery
              photos={vehicle.fotos}
              mainIndex={vehicle.fotoPrincipal}
              editable={false}
            />
          </section>
          <section className="panel space-y-3 p-4">
            <h3 className="font-display font-bold">Dados principais</h3>
            <InfoGrid
              rows={[
                ['Código', vehicle.codigoInterno],
                ['KM', formatNumber(vehicle.quilometragem)],
                ['Combustível', FUEL_LABELS[vehicle.combustivel]],
                ['Câmbio', TRANSMISSION_LABELS[vehicle.cambio]],
                ['Cor', vehicle.cor],
                ['Cidade', `${vehicle.cidade} - ${vehicle.estado}`],
                ['Anúncio', formatCurrency(vehicle.precoAnunciado)],
                ['Mínimo', formatCurrency(vehicle.precoMinimo)],
              ]}
            />
            <div className="pt-2">
              <label className="label-field">Alterar status</label>
              <Select
                value={vehicle.status}
                onChange={(e) => updateVehicle(vehicle.id, { status: e.target.value as VehicleStatus })}
              >
                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </Select>
            </div>
          </section>
        </div>
      ) : null}

      {tab === 'compra' ? (
        <section className="panel p-4">
          <InfoGrid
            rows={[
              ['Fornecedor', vehicle.fornecedor || '—'],
              ['Telefone', vehicle.telefoneFornecedor || '—'],
              ['Origem', vehicle.origem],
              ['Local', vehicle.localCompra || '—'],
              ['Data compra', formatDate(vehicle.dataCompra)],
              ['Valor compra', formatCurrency(vehicle.valorCompra)],
              ['Forma pagamento', vehicle.formaPagamentoCompra ? PAYMENT_LABELS[vehicle.formaPagamentoCompra] : '—'],
              ['Entrada', formatCurrency(vehicle.entradaCompra)],
              ['Financiamento', formatCurrency(vehicle.financiamentoCompra)],
            ]}
          />
          {vehicle.observacoesCompra ? (
            <p className="mt-4 text-sm text-lp-steel">{vehicle.observacoesCompra}</p>
          ) : null}
        </section>
      ) : null}

      {tab === 'custos' ? (
        <section className="panel p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display font-bold">Despesas ({vehicleExpenses.length})</h3>
            <Button size="sm" onClick={() => { setEditingExpenseId(null); setExpenseOpen(true) }}>
              Nova despesa
            </Button>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Fornecedor</th>
                  <th>Valor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {vehicleExpenses.map((e) => (
                  <tr key={e.id}>
                    <td>{formatDate(e.data)}</td>
                    <td>{e.descricao}</td>
                    <td>{EXPENSE_LABELS[e.categoria]}</td>
                    <td>{e.fornecedorNome || '—'}</td>
                    <td>{formatCurrency(e.valor)}</td>
                    <td>
                      <button
                        type="button"
                        className="text-xs text-lp-accent"
                        onClick={() => { setEditingExpenseId(e.id); setExpenseOpen(true) }}
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm font-semibold">
            Total despesas: {formatCurrency(sumExpenses(vehicleExpenses))} · Custo real: {formatCurrency(custoReal)}
          </p>
        </section>
      ) : null}

      {tab === 'documentos' ? (
        <section className="panel p-4">
          {vehicleDocs.length ? (
            <ul className="space-y-2">
              {vehicleDocs.map((d) => (
                <li key={d.id} className="flex items-center justify-between rounded-lg border border-lp-line px-3 py-2">
                  <span className="text-sm font-medium">{d.nome}</span>
                  <span className="text-xs text-lp-steel">{d.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-lp-steel">Nenhum documento anexado. Use a página Documentos para enviar arquivos.</p>
          )}
        </section>
      ) : null}

      {tab === 'preparacao' && checklist ? (
        <section className="panel p-4">
          <p className="mb-3 text-sm text-lp-steel">
            {checklist.items.filter((i) => i.done).length}/{checklist.items.length} concluídos
          </p>
          <ul className="space-y-2">
            {checklist.items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 rounded-lg border border-lp-line px-3 py-2">
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={(e) => toggleChecklist(vehicle.id, item.id, e.target.checked)}
                  className="h-4 w-4 accent-lp-accent"
                />
                <span className={item.done ? 'text-lp-steel line-through' : ''}>{item.label}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {tab === 'historico' ? <Timeline events={events} /> : null}

      {tab === 'financeiro' ? (
        <section className="panel grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Investimento" value={formatCurrency(metrics.investment)} />
          <Metric label="Despesas" value={formatCurrency(metrics.expensesTotal)} />
          <Metric label="Custo real" value={formatCurrency(metrics.custoReal)} />
          <Metric label="Lucro potencial" value={formatCurrency(lucroPotencial)} />
        </section>
      ) : null}

      {tab === 'venda' ? (
        <section className="panel p-4">
          {sale ? (
            <InfoGrid
              rows={[
                ['Cliente', sale.clienteNome],
                ['Data', formatDate(sale.dataVenda)],
                ['Valor', formatCurrency(sale.valorVendido)],
                ['Comissão', formatCurrency(sale.comissao)],
                ['Lucro líquido', formatCurrency(sale.lucroLiquido)],
                ['Margem', formatPercent(sale.margem)],
                ['ROI', formatPercent(sale.roi)],
                ['Dias estoque', `${sale.diasEstoque}d`],
              ]}
            />
          ) : (
            <p className="text-sm text-lp-steel">Veículo ainda não vendido.</p>
          )}
        </section>
      ) : null}

      <Modal open={expenseOpen} onClose={() => setExpenseOpen(false)} title={editingExpenseId ? 'Editar despesa' : 'Nova despesa'}>
        <ExpenseForm
          vehicleId={vehicle.id}
          initial={editingExpenseId ? vehicleExpenses.find((e) => e.id === editingExpenseId) : undefined}
          onCancel={() => setExpenseOpen(false)}
          onSubmit={async (data) => {
            if (editingExpenseId) await updateExpense(editingExpenseId, data)
            else await createExpense(data)
            setExpenseOpen(false)
          }}
        />
      </Modal>

      <Modal open={saleOpen} onClose={() => setSaleOpen(false)} title="Registrar venda" size="lg">
        <SaleForm
          vehicleId={vehicle.id}
          suggestedPrice={vehicle.precoAnunciado || vehicle.precoMinimo || vehicle.valorCompra}
          customers={customers}
          onSubmit={async (data) => {
            await createSale(data)
            setSaleOpen(false)
          }}
        />
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          await deleteVehicle(vehicle.id)
          navigate('/estoque')
        }}
        title="Excluir veículo"
        message="Esta ação não pode ser desfeita. Despesas e histórico vinculados serão removidos."
        danger
        confirmLabel="Excluir"
      />
    </div>
  )
}

function InfoGrid({ rows }: { rows: [string, string][] }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-lg bg-lp-mist/50 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-lp-steel">{label}</p>
          <p className="text-sm font-medium">{value}</p>
        </div>
      ))}
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-lp-line p-3">
      <p className="text-xs text-lp-steel">{label}</p>
      <p className="font-display text-lg font-bold">{value}</p>
    </div>
  )
}
