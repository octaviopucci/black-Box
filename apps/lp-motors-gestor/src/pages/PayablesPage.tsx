import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { PayableStatusBadge } from '@/components/common/StatusBadge'
import { EmptyState } from '@/components/ui/Feedback'
import { useApp } from '@/context/AppContext'
import { formatCurrency, formatDate } from '@/utils'
import { EXPENSE_LABELS } from '@/utils/constants'
import type { Payable } from '@/types'

export function PayablesPage() {
  const { payables, createPayable, updatePayable } = useApp()
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')

  const filtered = useMemo(() => {
    if (!filter) return payables
    return payables.filter((p) => p.status === filter)
  }, [payables, filter])

  const [form, setForm] = useState({
    descricao: '',
    categoria: 'geral' as Payable['categoria'],
    valor: 0,
    vencimento: new Date().toISOString().slice(0, 10),
    status: 'pendente' as Payable['status'],
    fornecedorNome: '',
    observacao: '',
    documentoUrl: '',
  })

  const submit = async () => {
    await createPayable(form)
    setOpen(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="section-title">Contas a Pagar</h1>
          <p className="section-sub">{filtered.length} conta(s)</p>
        </div>
        <Button onClick={() => setOpen(true)}>Nova conta</Button>
      </div>

      <select className="input-field w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="">Todos status</option>
        <option value="pendente">Pendente</option>
        <option value="vencido">Vencido</option>
        <option value="pago">Pago</option>
      </select>

      {!filtered.length ? (
        <EmptyState title="Nenhuma conta" />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Vencimento</th>
                <th>Fornecedor</th>
                <th>Valor</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>{p.descricao}</td>
                  <td>{formatDate(p.vencimento)}</td>
                  <td>{p.fornecedorNome || '—'}</td>
                  <td>{formatCurrency(p.valor)}</td>
                  <td><PayableStatusBadge status={p.status} /></td>
                  <td>
                    {p.status !== 'pago' ? (
                      <button type="button" className="text-xs font-semibold text-lp-accent" onClick={() => updatePayable(p.id, { status: 'pago' })}>
                        Marcar pago
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Nova conta">
        <div className="space-y-3">
          <Input label="Descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
          <Select label="Categoria" value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value as Payable['categoria'] })}>
            <option value="geral">Geral</option>
            {Object.entries(EXPENSE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </Select>
          <Input label="Valor" type="number" value={form.valor || ''} onChange={(e) => setForm({ ...form, valor: Number(e.target.value) })} />
          <Input label="Vencimento" type="date" value={form.vencimento} onChange={(e) => setForm({ ...form, vencimento: e.target.value })} />
          <Input label="Fornecedor" value={form.fornecedorNome} onChange={(e) => setForm({ ...form, fornecedorNome: e.target.value })} />
          <Button onClick={submit}>Salvar</Button>
        </div>
      </Modal>
    </div>
  )
}
