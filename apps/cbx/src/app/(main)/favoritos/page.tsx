'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import Link from 'next/link'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { ProductCard } from '@/components/cards/product-card'
import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/brand'
import { productService } from '@/services'
import { useAppStore } from '@/stores/app-store'
import { staggerContainer, staggerItem } from '@/animations/variants'

export default function FavoritosPage() {
  const { favorites, toggleFavorite, isFavorite } = useAppStore()

  const products = favorites
    .map((id) => productService.get(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)

  return (
    <PageShell>
      <Container className="py-6">
        <SectionHeader
          title="Favoritos"
          subtitle={
            products.length > 0
              ? `${products.length} ${products.length === 1 ? 'item salvo' : 'itens salvos'}`
              : 'Seus produtos favoritos aparecem aqui'
          }
        />

        {products.length === 0 ? (
          <EmptyState
            icon={Heart}
            title="Nenhum favorito ainda"
            description="Toque no coração nos anúncios para salvar aqui."
            action={
              <Button asChild>
                <Link href={ROUTES.busca}>Explorar anúncios</Link>
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
            {products.map((product) => (
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
