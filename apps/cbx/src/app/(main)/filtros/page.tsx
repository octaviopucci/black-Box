'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { Chip } from '@/components/ui/chip'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ROUTES } from '@/constants/brand'
import { categoryService } from '@/services'
import type { ProductCondition } from '@/types'
import { slideUp } from '@/animations/variants'

const CONDITIONS: { value: ProductCondition; label: string }[] = [
  { value: 'novo', label: 'Novo' },
  { value: 'seminovo', label: 'Seminovo' },
  { value: 'usado', label: 'Usado' },
]

const NEIGHBORHOODS = ['Centro', 'Jardim Europa', 'Vila Nova']

function FiltrosContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQ = searchParams.get('q') ?? ''

  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [conditions, setConditions] = useState<ProductCondition[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [neighborhood, setNeighborhood] = useState<string | null>(null)

  const allCategories = categoryService.list()

  const toggleCondition = (value: ProductCondition) => {
    setConditions((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
    )
  }

  const toggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (initialQ) params.set('q', initialQ)
    if (minPrice) params.set('min', minPrice)
    if (maxPrice) params.set('max', maxPrice)
    if (conditions.length) params.set('condicao', conditions.join(','))
    if (categories.length) params.set('categoria', categories.join(','))
    if (neighborhood) params.set('bairro', neighborhood)
    router.push(`${ROUTES.resultados}?${params.toString()}`)
  }

  return (
    <PageShell>
      <Container className="py-6">
        <motion.div variants={slideUp} initial="hidden" animate="visible">
          <SectionHeader
            title="Filtros"
            subtitle="Refine sua busca (visual — aplica na listagem)"
          />

          <div className="space-y-8">
            <section>
              <Label className="mb-3 block text-sm font-semibold">Faixa de preço</Label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="min-price" className="mb-1.5 block text-xs text-muted-foreground">
                    Mínimo (R$)
                  </Label>
                  <Input
                    id="min-price"
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="max-price" className="mb-1.5 block text-xs text-muted-foreground">
                    Máximo (R$)
                  </Label>
                  <Input
                    id="max-price"
                    type="number"
                    placeholder="10.000"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section>
              <Label className="mb-3 block text-sm font-semibold">Condição</Label>
              <div className="flex flex-wrap gap-2">
                {CONDITIONS.map((item) => (
                  <Chip
                    key={item.value}
                    selected={conditions.includes(item.value)}
                    onSelectedChange={() => toggleCondition(item.value)}
                  >
                    {item.label}
                  </Chip>
                ))}
              </div>
            </section>

            <section>
              <Label className="mb-3 block text-sm font-semibold">Categorias</Label>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((cat) => (
                  <Chip
                    key={cat.id}
                    selected={categories.includes(cat.id)}
                    onSelectedChange={() => toggleCategory(cat.id)}
                  >
                    {cat.name}
                  </Chip>
                ))}
              </div>
            </section>

            <section>
              <Label className="mb-3 block text-sm font-semibold">Bairro</Label>
              <div className="flex flex-wrap gap-2">
                {NEIGHBORHOODS.map((n) => (
                  <Chip
                    key={n}
                    selected={neighborhood === n}
                    onSelectedChange={() => setNeighborhood(neighborhood === n ? null : n)}
                  >
                    {n}
                  </Chip>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-10 flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setMinPrice('')
                setMaxPrice('')
                setConditions([])
                setCategories([])
                setNeighborhood(null)
              }}
            >
              Limpar
            </Button>
            <Button className="flex-1" onClick={applyFilters}>
              Aplicar filtros
            </Button>
          </div>
        </motion.div>
      </Container>
    </PageShell>
  )
}

export default function FiltrosPage() {
  return (
    <Suspense>
      <FiltrosContent />
    </Suspense>
  )
}
