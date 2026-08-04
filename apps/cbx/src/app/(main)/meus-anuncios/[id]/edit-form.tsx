'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/constants/brand'
import { categoryService } from '@/services'
import type { Product, ProductCondition } from '@/types'
import { cn } from '@/lib/utils'

const CONDITIONS: { value: ProductCondition; label: string }[] = [
  { value: 'novo', label: 'Novo' },
  { value: 'seminovo', label: 'Seminovo' },
  { value: 'usado', label: 'Usado' },
]

export function EditAdForm({ product }: { product: Product }) {
  const router = useRouter()
  const categories = categoryService.list()
  const [title, setTitle] = useState(product.title)
  const [description, setDescription] = useState(product.description)
  const [price, setPrice] = useState(
    product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
  )
  const [condition, setCondition] = useState(product.condition)
  const [categoryId, setCategoryId] = useState(product.categoryId)
  const [neighborhood, setNeighborhood] = useState(product.neighborhood)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 600))
    setSaving(false)
    toast.success('Anúncio atualizado com sucesso!')
    router.push(ROUTES.meusAnuncios)
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {product.images.map((img, i) => (
          <div
            key={img}
            className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-border/60 bg-muted"
          >
            <Image src={img} alt={`Foto ${i + 1}`} fill className="object-cover" sizes="80px" />
            {i === 0 && (
              <Badge variant="primary" className="absolute left-1 top-1 text-[10px]">
                Capa
              </Badge>
            )}
          </div>
        ))}
      </div>

      <Input label="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Textarea
        label="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={5}
      />
      <Input
        label="Preço"
        value={price}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, '')
          const cents = Number(digits)
          setPrice(
            cents > 0
              ? (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
              : '',
          )
        }}
      />
      <Input
        label="Bairro"
        value={neighborhood}
        onChange={(e) => setNeighborhood(e.target.value)}
      />

      <div>
        <p className="mb-2 text-sm font-medium">Condição</p>
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCondition(c.value)}
              className={cn(
                'rounded-lg border px-4 py-2 text-sm transition-colors',
                condition === c.value
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border/60 hover:border-primary/40',
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">Categoria</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryId(cat.id)}
              className={cn(
                'rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                categoryId === cat.id
                  ? 'border-primary bg-primary/5 text-primary'
                  : 'border-border/60 hover:border-primary/40',
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar alterações'}
        </Button>
        <Button variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
      </div>
    </div>
  )
}
