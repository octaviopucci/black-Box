import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { SearchBar } from '@/components/common/SearchBar'
import { CustomerForm } from '@/components/customers/CustomerForm'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog, Modal } from '@/components/ui/Modal'
import { EmptyState } from '@/components/ui/Feedback'
import { useApp } from '@/context/AppContext'
import { customerService } from '@/services/sales'
import { formatCurrency, formatDate } from '@/utils'
import type { Customer } from '@/types'

export function CustomersPage() {
  const { customers, createCustomer, updateCustomer, deleteCustomer, sales } = useApp()
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [deleting, setDeleting] = useState<Customer | null>(null)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const list = useMemo(() => customerService.list(search), [customers, search])
  const selected = customers.find((c) => c.id === selectedId)
  const history = selected ? sales.filter((s) => s.customerId === selected.id) : []

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-wide">Clientes</h1>
          <p className="mt-1 text-sm text-white/50">{list.length} cliente(s)</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
        >
          <Plus className="h-4 w-4" /> Novo cliente
        </Button>
      </div>

      <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nome, CPF, telefone..." />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="panel overflow-hidden xl:col-span-2">
          {!list.length ? (
            <div className="p-4">
              <EmptyState title="Nenhum cliente cadastrado" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-brand-gray/50 text-left text-xs uppercase tracking-wide text-white/45">
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">CPF</th>
                    <th className="px-4 py-3">Telefone</th>
                    <th className="px-4 py-3">Cidade</th>
                    <th className="px-4 py-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((c) => (
                    <tr
                      key={c.id}
                      className={`border-b border-brand-gray/30 hover:bg-white/[0.02] ${
                        selectedId === c.id ? 'bg-brand-red/5' : ''
                      }`}
                    >
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          className="font-medium hover:text-brand-red"
                          onClick={() => setSelectedId(c.id)}
                        >
                          {c.nome}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-white/70">{c.cpf || '—'}</td>
                      <td className="px-4 py-3 text-white/70">{c.telefone || '—'}</td>
                      <td className="px-4 py-3 text-white/70">{c.cidade || '—'}</td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditing(c)
                            setOpen(true)
                          }}
                        >
                          Editar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setDeleting(c)}>
                          Excluir
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <aside className="panel p-5">
          <h2 className="font-display text-lg font-semibold tracking-wide">Histórico de compras</h2>
          {!selected ? (
            <p className="mt-3 text-sm text-white/45">Selecione um cliente para ver o histórico.</p>
          ) : (
            <div className="mt-3 space-y-3">
              <div>
                <p className="font-medium">{selected.nome}</p>
                <p className="text-xs text-white/45">
                  {selected.email || 'Sem e-mail'} · {selected.endereco || 'Sem endereço'}
                </p>
              </div>
              {history.length ? (
                history.map((s) => (
                  <div
                    key={s.id}
                    className="rounded-xl border border-brand-gray/40 bg-brand-black/30 px-3 py-2.5"
                  >
                    <p className="text-sm font-medium">{formatCurrency(s.valorVendido)}</p>
                    <p className="text-xs text-white/45">{formatDate(s.dataVenda)}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-white/45">Sem compras registradas.</p>
              )}
            </div>
          )}
        </aside>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Editar cliente' : 'Novo cliente'}
      >
        <CustomerForm
          initial={editing || undefined}
          onCancel={() => setOpen(false)}
          onSubmit={async (data) => {
            if (editing) await updateCustomer(editing.id, data)
            else await createCustomer(data)
            setOpen(false)
          }}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Excluir cliente"
        message={`Confirma a exclusão de ${deleting?.nome}?`}
        danger
        confirmLabel="Excluir"
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (deleting) await deleteCustomer(deleting.id)
          setDeleting(null)
        }}
      />
    </div>
  )
}
