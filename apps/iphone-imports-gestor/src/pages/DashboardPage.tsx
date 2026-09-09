import { useMemo } from 'react'
import { loadDatabase } from '@/services/database'
import { formatCurrency } from '@/utils'

export function DashboardPage() {
  const db = loadDatabase()

  const stats = useMemo(() => {
    if (!db) return null
    const available = db.inventory.filter((u) => u.status === 'available').length
    const sold = db.inventory.filter((u) => u.status === 'sold').length
    const stockValue = db.inventory
      .filter((u) => u.status === 'available')
      .reduce((sum, u) => {
        const product = db.products.find((p) => p.id === u.productId)
        return sum + (product?.price || 0)
      }, 0)
    return {
      available,
      sold,
      products: db.products.length,
      customers: db.customers.length,
      stores: db.stores.filter((s) => s.active).length,
      stockValue,
      storeName: db.settings.storeName,
    }
  }, [db])

  if (!db || !stats) return <p>Carregue os dados fazendo login.</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black">{stats.storeName}</h1>
        <p className="text-brand-gray">Painel de gestão</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Unidades em estoque', value: stats.available },
          { label: 'Vendidas', value: stats.sold },
          { label: 'Produtos no catálogo', value: stats.products },
          { label: 'Clientes (CRM)', value: stats.customers },
        ].map((item) => (
          <div key={item.label} className="card">
            <p className="text-sm text-brand-gray">{item.label}</p>
            <p className="text-3xl font-black text-brand-yellow">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="card">
        <p className="text-sm text-brand-gray">Valor estimado em estoque</p>
        <p className="text-2xl font-bold">{formatCurrency(stats.stockValue)}</p>
        <p className="mt-2 text-xs text-brand-gray">{stats.stores} loja(s) ativa(s)</p>
      </div>
    </div>
  )
}
