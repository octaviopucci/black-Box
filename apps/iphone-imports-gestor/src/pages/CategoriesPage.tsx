import { useState } from 'react'
import type { CategoryRecord } from '@/types'
import { useDatabase } from '@/hooks/useDatabase'
import { persist } from '@/services/sync'
import { generateId, nowISO, slugify } from '@/utils'

export function CategoriesPage() {
  const [refresh, setRefresh] = useState(0)
  const db = useDatabase()

  function addCategory(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name'))
    const cat: CategoryRecord = {
      id: generateId('cat'),
      organizationId: db.organization.id,
      slug: slugify(name),
      name,
      description: String(fd.get('description') || name),
      image: String(fd.get('image') || 'https://images.unsplash.com/photo-1592286927505-4eed024c85d2?w=800&q=80'),
      active: true,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    db.categories.push(cat)
    persist(db)
    e.currentTarget.reset()
    setRefresh((r) => r + 1)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black">Categorias</h1>
      <form onSubmit={addCategory} className="card grid gap-3 sm:grid-cols-2">
        <input name="name" className="input" placeholder="Nome da categoria" required />
        <input name="description" className="input" placeholder="Descrição" />
        <input name="image" className="input sm:col-span-2" placeholder="URL da imagem" />
        <button type="submit" className="btn-primary sm:col-span-2">Adicionar categoria</button>
      </form>
      <div className="grid gap-2 sm:grid-cols-2">
        {db.categories.map((c) => (
          <div key={c.id} className="card">
            <p className="font-bold">{c.name}</p>
            <p className="text-xs text-brand-gray">/{c.slug}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-brand-gray" key={refresh} />
    </div>
  )
}
