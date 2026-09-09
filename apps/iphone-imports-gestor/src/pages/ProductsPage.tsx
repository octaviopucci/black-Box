import { useState } from 'react'
import type { CatalogProduct } from '@/types'
import { useDatabase } from '@/hooks/useDatabase'
import { persist } from '@/services/sync'
import { generateId, nowISO, slugify } from '@/utils'
import { formatCurrency } from '@/utils'

export function ProductsPage() {
  const [refresh, setRefresh] = useState(0)
  const db = useDatabase()

  function addProduct(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name'))
    const product: CatalogProduct = {
      id: generateId('prod'),
      organizationId: db.organization.id,
      categoryId: String(fd.get('categoryId')),
      slug: slugify(name),
      name,
      brand: String(fd.get('brand') || 'Apple'),
      description: String(fd.get('description') || name),
      shortDescription: String(fd.get('shortDescription') || name),
      price: Number(fd.get('price')),
      images: [String(fd.get('image') || 'https://images.unsplash.com/photo-1592286927505-4eed024c85d2?w=800&q=80')],
      published: true,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    db.products.unshift(product)
    persist(db)
    e.currentTarget.reset()
    setRefresh((r) => r + 1)
  }

  function togglePublished(id: string) {
    const p = db.products.find((x) => x.id === id)
    if (!p) return
    p.published = !p.published
    p.updatedAt = nowISO()
    persist(db)
    setRefresh((r) => r + 1)
  }

  const stockCount = (productId: string) =>
    db.inventory.filter((u) => u.productId === productId && u.status === 'available').length

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Produtos (catálogo)</h1>

      <form onSubmit={addProduct} className="card grid gap-3 sm:grid-cols-2">
        <h2 className="col-span-full font-bold">Novo produto</h2>
        <input name="name" className="input" placeholder="Nome" required />
        <select name="categoryId" className="input" required>
          {db.categories.filter((c) => c.active).map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input name="brand" className="input" placeholder="Marca" defaultValue="Apple" />
        <input name="price" className="input" type="number" placeholder="Preço" step="0.01" required />
        <input name="image" className="input sm:col-span-2" placeholder="URL da imagem" />
        <input name="shortDescription" className="input sm:col-span-2" placeholder="Descrição curta" />
        <textarea name="description" className="input sm:col-span-2" placeholder="Descrição completa" rows={2} />
        <button type="submit" className="btn-primary sm:col-span-2">Criar produto</button>
      </form>

      <div className="grid gap-3">
        {db.products.map((p) => (
          <div key={p.id} className="card flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold">{p.name}</p>
              <p className="text-sm text-brand-gray">{formatCurrency(p.price)} · Estoque: {stockCount(p.id)} un.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${p.published ? 'text-green-400' : 'text-brand-gray'}`}>
                {p.published ? 'Publicado' : 'Oculto'}
              </span>
              <button onClick={() => togglePublished(p.id)} className="btn-secondary text-xs">
                {p.published ? 'Ocultar' : 'Publicar'}
              </button>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-brand-gray" key={refresh}>Produtos publicados com estoque aparecem no site automaticamente.</p>
    </div>
  )
}
