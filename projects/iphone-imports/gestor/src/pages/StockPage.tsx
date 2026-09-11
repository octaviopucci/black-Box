import { useState } from 'react'
import type { DeviceCondition, InventoryUnit, InventoryStatus } from '@/types'
import { useDatabase } from '@/hooks/useDatabase'
import { persist } from '@/services/sync'
import { formatCurrency, generateId, nowISO } from '@/utils'

export function StockPage() {
  const [refresh, setRefresh] = useState(0)
  const [saleModal, setSaleModal] = useState<{ unitId: string; defaultPrice: number } | null>(null)
  const [salePriceInput, setSalePriceInput] = useState('')
  const db = useDatabase()

  const products = db.products
  const stores = db.stores.filter((s) => s.active)

  function addUnit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const productId = String(fd.get('productId'))
    const storeId = String(fd.get('storeId'))
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const unit: InventoryUnit = {
      id: generateId('unit'),
      organizationId: db.organization.id,
      productId,
      storeId,
      status: 'available',
      imei: String(fd.get('imei') || '') || undefined,
      serialNumber: String(fd.get('serial') || '') || undefined,
      color: String(fd.get('color') || '') || undefined,
      storage: String(fd.get('storage') || '') || undefined,
      batteryHealth: Number(fd.get('battery') || 0) || undefined,
      condition: (fd.get('condition') as DeviceCondition) || 'novo',
      purchasePrice: Number(fd.get('purchasePrice') || 0) || undefined,
      notes: String(fd.get('notes') || '') || undefined,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    db.inventory.unshift(unit)
    persist(db)
    e.currentTarget.reset()
    setRefresh((r) => r + 1)
  }

  function openSaleModal(unitId: string) {
    const unit = db.inventory.find((u) => u.id === unitId)
    if (!unit) return
    const product = products.find((p) => p.id === unit.productId)
    const defaultPrice = product?.price ?? 0
    setSalePriceInput(String(defaultPrice))
    setSaleModal({ unitId, defaultPrice })
  }

  function confirmSale() {
    if (!saleModal) return
    const unit = db.inventory.find((u) => u.id === saleModal.unitId)
    if (!unit) return
    const price = Number(salePriceInput) || saleModal.defaultPrice
    unit.status = 'sold'
    unit.salePrice = price
    unit.soldAt = nowISO()
    unit.updatedAt = nowISO()
    persist(db)
    setSaleModal(null)
    setRefresh((r) => r + 1)
  }

  function setStatus(unitId: string, status: InventoryStatus) {
    const unit = db.inventory.find((u) => u.id === unitId)
    if (!unit) return
    if (status === 'sold') {
      openSaleModal(unitId)
      return
    }
    unit.status = status
    unit.updatedAt = nowISO()
    persist(db)
    setRefresh((r) => r + 1)
  }

  const units = db.inventory

  return (
    <div className="space-y-6">
      <h1 className="page-title">Estoque por unidade</h1>

      {saleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="card w-full max-w-sm space-y-4">
            <h2 className="font-bold">Registrar venda</h2>
            <p className="text-sm text-brand-gray">Informe o valor da venda para o dashboard.</p>
            <div>
              <label className="mb-1 block text-xs text-brand-muted">Valor da venda (R$)</label>
              <input
                className="input"
                type="number"
                step="0.01"
                min={0}
                value={salePriceInput}
                onChange={(e) => setSalePriceInput(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn-primary flex-1" onClick={confirmSale}>
                Confirmar venda
              </button>
              <button type="button" className="btn-secondary flex-1" onClick={() => setSaleModal(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={addUnit} className="card grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <h2 className="col-span-full font-bold">Entrada de aparelho</h2>
        <select name="productId" className="input" required>
          <option value="">Produto</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <select name="storeId" className="input" required>
          {stores.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select name="condition" className="input" defaultValue="novo">
          <option value="novo">Novo</option>
          <option value="seminovo">Seminovo</option>
          <option value="usado">Usado</option>
        </select>
        <input name="imei" className="input" placeholder="IMEI" />
        <input name="serial" className="input" placeholder="Nº de série" />
        <input name="color" className="input" placeholder="Cor" />
        <input name="storage" className="input" placeholder="Armazenamento (ex: 256GB)" />
        <input name="battery" className="input" type="number" placeholder="Saúde bateria %" min={0} max={100} />
        <input name="purchasePrice" className="input" type="number" placeholder="Preço de custo" step="0.01" />
        <input name="notes" className="input" placeholder="Observações" />
        <button type="submit" className="btn-primary sm:col-span-2 lg:col-span-3">Adicionar ao estoque</button>
      </form>

      <div className="space-y-3 md:hidden">
        {units.map((u) => {
          const product = products.find((p) => p.id === u.productId)
          const store = db.stores.find((s) => s.id === u.storeId)
          return (
            <div key={u.id} className="card space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-bold leading-snug">{product?.name || u.productId}</p>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                    u.status === 'available'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : u.status === 'sold'
                        ? 'bg-brand-muted/30 text-brand-silver'
                        : 'bg-brand-border text-brand-gray'
                  }`}
                >
                  {u.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-brand-gray">
                <span>Loja: {store?.name || '—'}</span>
                <span>Bateria: {u.batteryHealth ? `${u.batteryHealth}%` : '—'}</span>
                <span className="col-span-2">IMEI: {u.imei || '—'}</span>
                <span className="col-span-2">Cor/GB: {u.color || '—'} / {u.storage || '—'}</span>
                {u.status === 'sold' && u.salePrice && (
                  <span className="col-span-2 font-semibold text-brand-silver">
                    Venda: {formatCurrency(u.salePrice)}
                  </span>
                )}
              </div>
              {u.status === 'available' && (
                <button
                  type="button"
                  onClick={() => setStatus(u.id, 'sold')}
                  className="btn-secondary w-full text-xs"
                >
                  Marcar vendido
                </button>
              )}
            </div>
          )
        })}
        {units.length === 0 && <p className="text-center text-sm text-brand-gray">Nenhuma unidade cadastrada.</p>}
      </div>

      <div className="table-wrap hidden md:block">
        <table>
          <thead className="bg-brand-surface text-brand-gray">
            <tr>
              <th className="p-3">Produto</th>
              <th className="p-3">Loja</th>
              <th className="p-3">IMEI / Série</th>
              <th className="p-3">Cor / GB</th>
              <th className="p-3">Bateria</th>
              <th className="p-3">Status</th>
              <th className="p-3">Venda</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {units.map((u) => {
              const product = products.find((p) => p.id === u.productId)
              const store = db.stores.find((s) => s.id === u.storeId)
              return (
                <tr key={u.id} className="border-t border-brand-border">
                  <td className="p-3 font-medium">{product?.name || u.productId}</td>
                  <td className="p-3">{store?.name}</td>
                  <td className="p-3 text-xs text-brand-gray">{u.imei || '—'} / {u.serialNumber || '—'}</td>
                  <td className="p-3">{u.color || '—'} / {u.storage || '—'}</td>
                  <td className="p-3">{u.batteryHealth ? `${u.batteryHealth}%` : '—'}</td>
                  <td className="p-3">
                    <span className={`rounded px-2 py-0.5 text-xs font-bold ${
                      u.status === 'available' ? 'bg-emerald-500/20 text-emerald-400' :
                      u.status === 'sold' ? 'bg-brand-muted/30 text-brand-silver' : 'bg-brand-border text-brand-gray'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-brand-gray">
                    {u.status === 'sold' && u.salePrice ? formatCurrency(u.salePrice) : '—'}
                  </td>
                  <td className="p-3">
                    {u.status === 'available' && (
                      <button onClick={() => setStatus(u.id, 'sold')} className="text-xs text-brand-silver hover:underline">
                        Marcar vendido
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {units.length === 0 && <p className="p-6 text-center text-brand-gray">Nenhuma unidade cadastrada.</p>}
      </div>
      <p className="text-xs text-brand-gray" key={refresh}>
        Alterações sincronizam automaticamente com o site (produtos com estoque &gt; 0 aparecem no catálogo).
      </p>
    </div>
  )
}
