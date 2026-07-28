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
import {
  FUEL_LABELS,
  TRANSMISSION_LABELS,
  EXPENSE_LABELS,
  PAYMENT_LABELS,
  STATUS_LABELS,
} from '@/utils/constants'
import {
  daysBetween,
  formatCurrency,
  formatDate,
  formatNumber,
  formatPercent,
  printElement,
} from '@/utils'
import { calcSaleMetrics, sumExpenses } from '@/utils/finance'
import type { VehicleStatus } from '@/types'
import { Select } from '@/components/ui/Input'

export function VehicleDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    vehicles,
    expenses,
    customers,
    history,
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
  } = useApp()

  const vehicle = vehicles.find((v) => v.id === id)
  const vehicleExpenses = useMemo(
    () => expenses.filter((e) => e.vehicleId === id).sort((a, b) => b.data.localeCompare(a.data)),
    [expenses, id],
  )
  const sale = useMemo(
    () => (id ? saleService.getByVehicle(id) : undefined),
    // recompute when sales change via vehicles status / refresh
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, vehicles, expenses],
  )
  const events = useMemo(
    () =>
      history
        .filter((h) => h.vehicleId === id)
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [history, id],
  )

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [saleOpen, setSaleOpen] = useState(false)
  const [expenseOpen, setExpenseOpen] = useState(false)
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null)

  if (!ready) return <Loading />
  if (!vehicle) {
    return <EmptyState title="Veículo não encontrado" />
  }

  const metrics = calcSaleMetrics(
    vehicle,
    vehicleExpenses,
    sale?.valorVendido || vehicle.precoAnunciado || 0,
    sale?.comissao || 0,
    sale?.dataVenda || new Date().toISOString(),
  )
  const expenseTotal = sumExpenses(vehicleExpenses)
  const days = daysBetween(vehicle.dataCompra, sale?.dataVenda)

  const printFicha = () => {
    printElement(
      `Ficha ${vehicle.marca} ${vehicle.modelo}`,
      `<h1>Maciel Motors — Ficha do Veículo</h1>
      <p class="meta">${vehicle.marca} ${vehicle.modelo} ${vehicle.versao}</p>
      <table>
        <tr><th>Placa</th><td>${vehicle.placa || '—'}</td><th>Status</th><td>${vehicle.status}</td></tr>
        <tr><th>Ano</th><td>${vehicle.ano}/${vehicle.anoModelo}</td><th>Cor</th><td>${vehicle.cor}</td></tr>
        <tr><th>KM</th><td>${formatNumber(vehicle.quilometragem)}</td><th>Combustível</th><td>${FUEL_LABELS[vehicle.combustivel]}</td></tr>
        <tr><th>Compra</th><td>${formatCurrency(vehicle.valorCompra)}</td><th>Anúncio</th><td>${formatCurrency(vehicle.precoAnunciado)}</td></tr>
        <tr><th>Chassi</th><td colspan="3">${vehicle.chassi || '—'}</td></tr>
        <tr><th>Renavam</th><td colspan="3">${vehicle.renavam || '—'}</td></tr>
      </table>
      <h2>Observações</h2>
      <p>${vehicle.observacoes || '—'}</p>`,
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={vehicle.status} />
            {vehicle.consignado ? (
              <span className="rounded-full border border-sky-500/40 bg-sky-500/15 px-2.5 py-0.5 text-xs text-sky-300">
                Consignado
              </span>
            ) : null}
            {vehicle.archived ? (
              <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-xs text-white/60">
                Arquivado
              </span>
            ) : null}
            {vehicle.status !== 'vendido' && vehicle.status !== 'entregue' ? (
              <div className="ml-auto w-full sm:ml-2 sm:w-48">
                <Select
                  label="Alterar status"
                  value={vehicle.status}
                  onChange={async (e) => {
                    const status = e.target.value as VehicleStatus
                    await updateVehicle(vehicle.id, {
                      status,
                      consignado: status === 'consignado',
                    })
                  }}
                >
                  {Object.entries(STATUS_LABELS)
                    .filter(([k]) => k !== 'vendido' && k !== 'entregue')
                    .map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                </Select>
              </div>
            ) : null}
          </div>
          <h1 className="font-display text-3xl font-bold tracking-wide">
            {vehicle.marca} {vehicle.modelo}
          </h1>
          <p className="mt-1 text-sm text-white/50">
            {vehicle.versao} · {vehicle.ano}/{vehicle.anoModelo} · {vehicle.placa || 'S/ placa'} ·{' '}
            {days} dias em estoque
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to={`/veiculos/${vehicle.id}/editar`}>
            <Button variant="secondary">
              <Pencil className="h-4 w-4" /> Editar
            </Button>
          </Link>
          <Button
            variant="secondary"
            onClick={async () => {
              const copy = await duplicateVehicle(vehicle.id)
              navigate(`/veiculos/${copy.id}`)
            }}
          >
            <Copy className="h-4 w-4" /> Duplicar
          </Button>
          {vehicle.status !== 'vendido' && vehicle.status !== 'entregue' ? (
            <Button onClick={() => setSaleOpen(true)}>
              <ShoppingCart className="h-4 w-4" /> Vender
            </Button>
          ) : null}
          <Button variant="secondary" onClick={printFicha}>
            <Printer className="h-4 w-4" /> Imprimir ficha
          </Button>
          {vehicle.archived ? (
            <Button variant="secondary" onClick={() => restoreVehicle(vehicle.id)}>
              <RotateCcw className="h-4 w-4" /> Restaurar
            </Button>
          ) : (
            <Button variant="secondary" onClick={() => archiveVehicle(vehicle.id)}>
              <Archive className="h-4 w-4" /> Arquivar
            </Button>
          )}
          <Button variant="danger" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="h-4 w-4" /> Excluir
          </Button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="panel space-y-4 p-5 xl:col-span-2">
          <h2 className="font-display text-lg font-semibold tracking-wide">Galeria</h2>
          <PhotoGallery
            photos={vehicle.fotos}
            mainIndex={vehicle.fotoPrincipal}
            editable={false}
            onChange={() => undefined}
          />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ['Categoria', vehicle.categoria],
              ['Cor', vehicle.cor],
              ['Combustível', FUEL_LABELS[vehicle.combustivel]],
              ['Câmbio', TRANSMISSION_LABELS[vehicle.cambio]],
              ['Motor', vehicle.motor || '—'],
              ['KM', formatNumber(vehicle.quilometragem)],
              ['Cidade', `${vehicle.cidade}/${vehicle.estado}`],
              ['Fornecedor', vehicle.fornecedor || '—'],
              ['Telefone fornecedor', vehicle.telefoneFornecedor || '—'],
              ['Origem', vehicle.origem],
              ['Data compra', formatDate(vehicle.dataCompra)],
              ['FIPE', formatCurrency(vehicle.precoFipe)],
              ['Renavam', vehicle.renavam || '—'],
              ['Chassi', vehicle.chassi || '—'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-brand-black/40 px-3 py-2.5">
                <p className="text-[11px] uppercase tracking-wide text-white/40">{label}</p>
                <p className="mt-0.5 text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
          {vehicle.observacoes ? (
            <div>
              <p className="text-[11px] uppercase tracking-wide text-white/40">Observações</p>
              <p className="mt-1 text-sm text-white/75">{vehicle.observacoes}</p>
            </div>
          ) : null}
        </section>

        <section className="space-y-4">
          <div className="panel space-y-3 p-5">
            <h2 className="font-display text-lg font-semibold tracking-wide">Financeiro</h2>
            <Metric label="Valor de compra" value={formatCurrency(vehicle.valorCompra)} />
            <Metric label="Preço anunciado" value={formatCurrency(vehicle.precoAnunciado)} />
            <Metric label="Preço mínimo" value={formatCurrency(vehicle.precoMinimo)} />
            <Metric label="Despesas" value={formatCurrency(expenseTotal)} />
            <Metric label="Investimento" value={formatCurrency(metrics.investment)} />
            {sale ? (
              <>
                <Metric label="Valor vendido" value={formatCurrency(sale.valorVendido)} accent />
                <Metric label="Lucro bruto" value={formatCurrency(sale.lucroBruto)} />
                <Metric label="Lucro líquido" value={formatCurrency(sale.lucroLiquido)} accent />
                <Metric label="ROI" value={formatPercent(sale.roi)} />
                <Metric label="Margem" value={formatPercent(sale.margem)} />
                <Metric
                  label="Pagamento"
                  value={`${PAYMENT_LABELS[sale.formaPagamento]} · ${sale.clienteNome}`}
                />
              </>
            ) : (
              <>
                <Metric label="Lucro potencial bruto" value={formatCurrency(metrics.lucroBruto)} />
                <Metric label="Lucro potencial líquido" value={formatCurrency(metrics.lucroLiquido)} />
                <Metric label="ROI potencial" value={formatPercent(metrics.roi)} />
              </>
            )}
          </div>

          <div className="panel p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold tracking-wide">Despesas</h2>
              <Button size="sm" onClick={() => setExpenseOpen(true)}>
                Nova
              </Button>
            </div>
            <div className="space-y-2">
              {vehicleExpenses.length ? (
                vehicleExpenses.map((e) => (
                  <div
                    key={e.id}
                    className="rounded-xl border border-brand-gray/40 bg-brand-black/30 px-3 py-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">{e.descricao}</p>
                        <p className="text-xs text-white/45">
                          {EXPENSE_LABELS[e.categoria]} · {formatDate(e.data)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">{formatCurrency(e.valor)}</p>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingExpenseId(e.id)
                          setExpenseOpen(true)
                        }}
                      >
                        Editar
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteExpense(e.id)}>
                        Excluir
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/45">Nenhuma despesa registrada.</p>
              )}
            </div>
            <p className="mt-3 border-t border-brand-gray/40 pt-3 text-sm">
              Total: <strong>{formatCurrency(expenseTotal)}</strong>
            </p>
          </div>
        </section>
      </div>

      <section className="panel p-5">
        <h2 className="mb-4 font-display text-lg font-semibold tracking-wide">
          Histórico / Linha do tempo
        </h2>
        <Timeline events={events} />
      </section>

      <Modal
        open={expenseOpen}
        onClose={() => {
          setExpenseOpen(false)
          setEditingExpenseId(null)
        }}
        title={editingExpenseId ? 'Editar despesa' : 'Nova despesa'}
      >
        <ExpenseForm
          vehicleId={vehicle.id}
          initial={vehicleExpenses.find((e) => e.id === editingExpenseId)}
          onCancel={() => {
            setExpenseOpen(false)
            setEditingExpenseId(null)
          }}
          onSubmit={async (data) => {
            if (editingExpenseId) await updateExpense(editingExpenseId, data)
            else await createExpense(data)
            setExpenseOpen(false)
            setEditingExpenseId(null)
          }}
        />
      </Modal>

      <Modal open={saleOpen} onClose={() => setSaleOpen(false)} title="Registrar venda" size="lg">
        <SaleForm
          vehicleId={vehicle.id}
          suggestedPrice={vehicle.precoAnunciado || vehicle.precoMinimo || vehicle.valorCompra}
          customers={customers}
          onCancel={() => setSaleOpen(false)}
          onSubmit={async (data) => {
            await createSale(data)
            setSaleOpen(false)
          }}
        />
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        title="Excluir veículo"
        message="Esta ação remove o veículo e suas despesas. Não é possível desfazer."
        confirmLabel="Excluir"
        danger
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          await deleteVehicle(vehicle.id)
          navigate('/estoque')
        }}
      />
    </div>
  )
}

function Metric({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-white/45">{label}</span>
      <span className={accent ? 'font-semibold text-emerald-400' : 'font-medium'}>{value}</span>
    </div>
  )
}
