'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

import { ProductCard } from '@/components/cards/product-card'
import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { StaggerGrid, StaggerItem, ScrollSection } from '@/components/home/scroll-section'
import { EmptyState } from '@/components/ui/empty-state'
import { ROUTES } from '@/constants/brand'
import { categoryService } from '@/services'
import { useLiveCategories, useLiveProducts } from '@/hooks/use-live-catalog'
import { useAppStore } from '@/stores/app-store'

export function CategoryDetailClient({ slug }: { slug: string }) {
  const { isFavorite, toggleFavorite } = useAppStore()
  const categories = useLiveCategories()
  const category =
    categories.find((c) => c.slug === slug) ?? categoryService.getBySlug(slug)
  const { products: liveProducts } = useLiveProducts(
    category ? { categoryId: category.id } : undefined,
  )
  const products = useMemo(
    () => (category ? liveProducts.filter((p) => p.categoryId === category.id) : []),
    [category, liveProducts],
  )

  if (!category) {
    return (
      <PageShell>
        <Container className="py-12">
          <EmptyState
            title="Categoria não encontrada"
            description="A categoria que você procura não existe ou foi removida."
            action={
              <Link href={ROUTES.categorias} className="text-sm font-semibold text-primary hover:underline">
                Voltar às categorias
              </Link>
            }
          />
        </Container>
      </PageShell>
    )
  }

  return (
    <PageShell>
      <ScrollSection className="pt-4">
        <Container>
          <Link
            href={ROUTES.categorias}
            className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Categorias
          </Link>

          <SectionHeader
            title={category.name}
            subtitle={`${category.productCount} anúncios disponíveis`}
          />

          {products.length === 0 ? (
            <EmptyState
              title="Nenhum anúncio ainda"
              description={`Ainda não há produtos na categoria ${category.name}. Volte em breve!`}
            />
          ) : (
            <StaggerGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
              {products.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard
                    product={p}
                    favorited={isFavorite(p.id)}
                    onFavoriteToggle={toggleFavorite}
                  />
                </StaggerItem>
              ))}
            </StaggerGrid>
          )}
        </Container>
      </ScrollSection>
    </PageShell>
  )
}
