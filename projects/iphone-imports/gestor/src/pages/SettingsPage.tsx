import { useState } from 'react'
import type { StoreLocation } from '@/types'
import { useDatabase } from '@/hooks/useDatabase'
import { persist } from '@/services/sync'
import { generateId, nowISO } from '@/utils'

export function SettingsPage() {
  const [refresh, setRefresh] = useState(0)
  const db = useDatabase()

  function saveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const storeName = String(fd.get('storeName'))
    db.settings.storeName = storeName
    db.settings.whatsapp = String(fd.get('whatsapp'))
    db.settings.hours = String(fd.get('hours') || '')
    db.settings.topBarMessage = String(fd.get('topBarMessage') || '')
    db.organization.name = storeName
    db.settings.updatedAt = nowISO()
    persist(db)
    setRefresh((r) => r + 1)
  }

  function addStore(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const store: StoreLocation = {
      id: generateId('store'),
      organizationId: db.organization.id,
      name: String(fd.get('name')),
      address: String(fd.get('address') || '') || undefined,
      city: String(fd.get('city') || '') || undefined,
      phone: String(fd.get('phone') || '') || undefined,
      active: true,
      createdAt: nowISO(),
    }
    db.stores.push(store)
    persist(db)
    e.currentTarget.reset()
    setRefresh((r) => r + 1)
  }

  return (
    <div className="space-y-6">
      <h1 className="page-title">Configurações</h1>

      <form onSubmit={saveSettings} className="card space-y-3">
        <h2 className="font-bold">Dados da loja</h2>
        <p className="text-xs text-brand-gray">Código: {db.organization.slug}</p>
        <input name="storeName" className="input" defaultValue={db.settings.storeName} placeholder="Nome da loja" required />
        <input name="whatsapp" className="input" defaultValue={db.settings.whatsapp} placeholder="WhatsApp" required />
        <input name="hours" className="input" defaultValue={db.settings.hours} placeholder="Horário" />
        <input name="topBarMessage" className="input" defaultValue={db.settings.topBarMessage} placeholder="Mensagem do topo" />
        <button type="submit" className="btn-primary">Salvar</button>
      </form>

      <form onSubmit={addStore} className="card space-y-3">
        <h2 className="font-bold">Adicionar loja / filial</h2>
        <input name="name" className="input" placeholder="Nome da filial" required />
        <input name="address" className="input" placeholder="Endereço" />
        <input name="city" className="input" placeholder="Cidade" />
        <input name="phone" className="input" placeholder="Telefone" />
        <button type="submit" className="btn-secondary">Adicionar loja</button>
      </form>

      <div className="card space-y-2">
        <h2 className="font-bold">Lojas cadastradas</h2>
        {db.stores.map((s) => (
          <div key={s.id} className="flex items-center justify-between rounded-lg bg-black/30 p-3">
            <div>
              <p className="font-medium">{s.name}</p>
              <p className="text-xs text-brand-gray">{s.city || s.address || '—'}</p>
            </div>
            <span className={`text-xs font-bold ${s.active ? 'text-green-400' : 'text-red-400'}`}>
              {s.active ? 'Ativa' : 'Inativa'}
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-brand-gray" key={refresh} />
    </div>
  )
}
