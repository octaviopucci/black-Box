import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input, Select } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/Feedback'
import { useApp } from '@/context/AppContext'
import { formatCurrency } from '@/utils'
import { SUPPLIER_TYPES } from '@/utils/constants'
import { supplierService } from '@/services/expenses'

export function SuppliersPage() {
  const { suppliers, createSupplier } = useApp()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nome: '', tipo: 'Mecânico', telefone: '', email: '', cidade: '', observacoes: '' })

  const stats = supplierService.stats()

  const submit = async () => {
    await createSupplier(form)
    setOpen(false)
    setForm({ nome: '', tipo: 'Mecânico', telefone: '', email: '', cidade: '', observacoes: '' })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="section-title">Fornecedores</h1>
          <p className="section-sub">{suppliers.length} cadastrado(s)</p>
        </div>
        <Button onClick={() => setOpen(true)}>Novo fornecedor</Button>
      </div>

      {!suppliers.length ? (
        <EmptyState title="Nenhum fornecedor" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map(({ supplier, count, total }) => (
            <div key={supplier.id} className="panel p-4">
              <p className="font-display font-bold">{supplier.nome}</p>
              <p className="text-sm text-lp-steel">{supplier.tipo} · {supplier.cidade || '—'}</p>
              <p className="mt-2 text-xs text-lp-steel">{supplier.telefone} · {supplier.email}</p>
              <div className="mt-3 flex gap-4 text-sm">
                <span>{count} despesas</span>
                <span className="font-semibold">{formatCurrency(total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Novo fornecedor">
        <div className="space-y-3">
          <Input label="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
          <Select label="Tipo" value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })}>
            {SUPPLIER_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
          <Input label="Telefone" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
          <Input label="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input label="Cidade" value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} />
          <Button onClick={submit}>Salvar</Button>
        </div>
      </Modal>
    </div>
  )
}
