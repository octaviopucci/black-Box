'use client'

import { Suspense, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { SlidersHorizontal, SearchX } from 'lucide-react'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { ProductCard } from '@/components/cards/product-card'
import { Chip } from '@/components/ui/chip'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { ROUTES } from '@/constants/brand'
import { useLiveProducts } from '@/hooks/use-live-catalog'
import { useAppStore } from '@/stores/app-store'
import { staggerContainer, staggerItem } from '@/animations/variants'
import type { Product } from '@/types'

type SortOption = 'relevancia' | 'menor-preco' | 'maior-preco' | 'recentes'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'relevancia', label: 'Relevância' },
  { value: 'menor-preco', label: 'Menor preço' },
  { value: 'maior-preco', label: 'Maior preço' },
  { value: 'recentes', label: 'Mais recentes' },
]

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const sorted = [...products]
  switch (sort) {
    case 'menor-preco':
      return sorted.sort((a, b) => a.price - b.price)
    case 'maior-preco':
      return sorted.sort((a, b) => b.price - a.price)
    case 'recentes':
      return sorted.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    default:
      return sorted
  }
}

function ResultadosContent() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') ?? ''
  const [sort, setSort] = useState<SortOption>('relevancia')
  const { toggleFavorite, isFavorite } = useAppStore()
  const { products: found } = useLiveProducts({ q: q || undefined })

  const results = useMemo(() => sortProducts(found, sort), [found, sort])

  return (
    <PageShell>
      <Container className="py-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <SectionHeader
            title={q ? `Resultados para "${q}"` : 'Todos os anúncios'}
            subtitle={`${results.length} ${results.length === 1 ? 'anúncio encontrado' : 'anúncios encontrados'}`}
          />
          <Button variant="outline" size="sm" asChild>
            <Link href={ROUTES.filtros}>
              <SlidersHorizontal className="size-4" />
              Filtros
            </Link>
          </Button>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {SORT_OPTIONS.map((option) => (
            <Chip
              key={option.value}
              selected={sort === option.value}
              onSelectedChange={() => setSort(option.value)}
              size="sm"
            >
              {option.label}
            </Chip>
          ))}
        </div>

        {results.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Nenhum resultado encontrado"
            description="Tente buscar com outras palavras ou ajuste os filtros."
            action={
              <Button asChild>
                <Link href={ROUTES.busca}>Nova busca</Link>
              </Button>
            }
          />
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
          >
            {results.map((product) => (
              <motion.div key={product.id} variants={staggerItem}>
                <ProductCard
                  product={product}
                  favorited={isFavorite(product.id)}
                  onFavoriteToggle={toggleFavorite}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </Container>
    </PageShell>
  )
}

function ResultadosFallback() {
  return (
    <PageShell>
      <Container className="py-6">
        <Skeleton className="mb-4 h-8 w-48" />
        <Skeleton className="mb-6 h-10 w-full" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/5] rounded-xl" />
          ))}
        </div>
      </Container>
    </PageShell>
  )
}

export default function ResultadosPage() {
  return (
    <Suspense fallback={<ResultadosFallback />}>
      <ResultadosContent />
    </Suspense>
  )
}
