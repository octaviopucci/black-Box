import { useState } from 'react'
import type { CrmInteraction, CustomerRecord } from '@/types'
import { useDatabase } from '@/hooks/useDatabase'
import { persist } from '@/services/sync'
import { generateId, nowISO } from '@/utils'

export function CustomersPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [refresh, setRefresh] = useState(0)
  const db = useDatabase()

  function addCustomer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const customer: CustomerRecord = {
      id: generateId('cust'),
      organizationId: db.organization.id,
      name: String(fd.get('name')),
      phone: String(fd.get('phone')),
      email: String(fd.get('email') || '') || undefined,
      notes: String(fd.get('notes') || '') || undefined,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    db.customers.unshift(customer)
    persist(db)
    e.currentTarget.reset()
    setRefresh((r) => r + 1)
  }

  function addInteraction(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!selectedId) return
    const fd = new FormData(e.currentTarget)
    const interaction: CrmInteraction = {
      id: generateId('int'),
      organizationId: db.organization.id,
      customerId: selectedId,
      type: (fd.get('type') as CrmInteraction['type']) || 'note',
      description: String(fd.get('description')),
      createdAt: nowISO(),
    }
    db.interactions.unshift(interaction)
    persist(db)
    e.currentTarget.reset()
    setRefresh((r) => r + 1)
  }

  const selected = db.customers.find((c) => c.id === selectedId)
  const interactions = db.interactions.filter((i) => i.customerId === selectedId)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">CRM — Clientes</h1>

      <form onSubmit={addCustomer} className="card grid gap-3 sm:grid-cols-2">
        <h2 className="col-span-full font-bold">Novo cliente</h2>
        <input name="name" className="input" placeholder="Nome" required />
        <input name="phone" className="input" placeholder="Telefone / WhatsApp" required />
        <input name="email" className="input" placeholder="E-mail" />
        <input name="notes" className="input" placeholder="Observações" />
        <button type="submit" className="btn-primary sm:col-span-2">Cadastrar cliente</button>
      </form>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          {db.customers.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedId(c.id)}
              className={`card w-full text-left transition ${selectedId === c.id ? 'border-brand-yellow' : ''}`}
            >
              <p className="font-bold">{c.name}</p>
              <p className="text-sm text-brand-gray">{c.phone}</p>
            </button>
          ))}
        </div>

        {selected && (
          <div className="card space-y-4">
            <h3 className="font-bold">{selected.name}</h3>
            <form onSubmit={addInteraction} className="space-y-2">
              <select name="type" className="input">
                <option value="whatsapp">WhatsApp</option>
                <option value="call">Ligação</option>
                <option value="visit">Visita</option>
                <option value="sale">Venda</option>
                <option value="note">Nota</option>
              </select>
              <textarea name="description" className="input" placeholder="Registro de interação" rows={2} required />
              <button type="submit" className="btn-primary">Registrar</button>
            </form>
            <div className="space-y-2">
              {interactions.map((i) => (
                <div key={i.id} className="rounded-lg bg-black/30 p-2 text-sm">
                  <span className="text-xs font-bold text-brand-yellow">{i.type}</span>
                  <p>{i.description}</p>
                  <p className="text-[10px] text-brand-gray">{new Date(i.createdAt).toLocaleString('pt-BR')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <p className="text-xs text-brand-gray" key={refresh} />
    </div>
  )
}
