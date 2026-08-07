'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Eye,
  Heart,
  Package,
  PauseCircle,
  Pencil,
  Plus,
  Rocket,
} from 'lucide-react'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs } from '@/components/ui/tabs'
import { EmptyState } from '@/components/ui/empty-state'
import { ROUTES } from '@/constants/brand'
import { useMyListings } from '@/hooks/use-live-catalog'
import { formatCurrency } from '@/lib/utils'
import { staggerContainer, staggerItem } from '@/animations/variants'
import type { AdStatus } from '@/types'

const TABS = [
  { id: 'todos', label: 'Todos' },
  { id: 'ativos', label: 'Ativos' },
  { id: 'pausados', label: 'Pausados' },
]

const STATUS_VARIANT: Record<AdStatus, 'success' | 'warning' | 'neutral' | 'danger'> = {
  ativo: 'success',
  pausado: 'warning',
  vendido: 'neutral',
  rascunho: 'neutral',
  expirado: 'danger',
}

export default function MeusAnunciosPage() {
  const [tab, setTab] = useState('todos')
  const { products: allProducts } = useMyListings()

  const filtered = useMemo(() => {
    if (tab === 'ativos') return allProducts.filter((p) => p.status === 'ativo')
    if (tab === 'pausados') return allProducts.filter((p) => p.status === 'pausado')
    return allProducts
  }, [allProducts, tab])

  const stats = useMemo(
    () => ({
      total: allProducts.length,
      ativos: allProducts.filter((p) => p.status === 'ativo').length,
      pausados: allProducts.filter((p) => p.status === 'pausado').length,
      views: allProducts.reduce((sum, p) => sum + p.views, 0),
      favorites: allProducts.reduce((sum, p) => sum + p.favorites, 0),
    }),
    [allProducts],
  )

  return (
    <PageShell>
      <Container className="py-6">
        <SectionHeader
          title="Meus anúncios"
          subtitle={`${stats.total} ${stats.total === 1 ? 'anúncio' : 'anúncios'} publicados`}
          action={
            <Button asChild size="sm">
              <Link href={ROUTES.publicar}>
                <Plus className="mr-1 size-4" />
                Novo
              </Link>
            </Button>
          }
        />

        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <Package className="mb-1 size-5 text-primary" />
            <p className="text-xl font-bold">{stats.total}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <Eye className="mb-1 size-5 text-primary" />
            <p className="text-xl font-bold">{stats.views}</p>
            <p className="text-xs text-muted-foreground">Visualizações</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <Heart className="mb-1 size-5 text-primary" />
            <p className="text-xl font-bold">{stats.favorites}</p>
            <p className="text-xs text-muted-foreground">Favoritos</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4">
            <PauseCircle className="mb-1 size-5 text-primary" />
            <p className="text-xl font-bold">{stats.pausados}</p>
            <p className="text-xs text-muted-foreground">Pausados</p>
          </div>
        </div>

        <Tabs tabs={TABS} value={tab} onValueChange={setTab} className="mb-6" layoutId="meus-anuncios-tabs" />

        {filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title={tab === 'pausados' ? 'Nenhum anúncio pausado' : 'Nenhum anúncio encontrado'}
            description={
              tab === 'todos'
                ? 'Publique seu primeiro anúncio e comece a vender em Capão Bonito.'
                : 'Não há anúncios nesta categoria no momento.'
            }
            action={
              tab === 'todos' ? (
                <Button asChild>
                  <Link href={ROUTES.publicar}>Publicar anúncio</Link>
                </Button>
              ) : undefined
            }
          />
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {filtered.map((product) => (
              <motion.article
                key={product.id}
                variants={staggerItem}
                className="flex gap-3 rounded-xl border border-border/60 bg-card p-3 sm:gap-4 sm:p-4"
              >
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-24">
                  {product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-sm font-semibold sm:text-base">
                        {product.title}
                      </h3>
                      <p className="mt-0.5 text-sm font-bold text-primary">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                    <Badge variant={STATUS_VARIANT[product.status]} className="capitalize">
                      {product.status}
                    </Badge>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="size-3" />
                      {product.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="size-3" />
                      {product.favorites}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={ROUTES.editarAnuncio(product.id)}>
                        <Pencil className="mr-1 size-3.5" />
                        Editar
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={ROUTES.estatisticas(product.id)}>
                        <BarChart3 className="mr-1 size-3.5" />
                        Estatísticas
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={ROUTES.impulsionar(product.id)}>
                        <Rocket className="mr-1 size-3.5" />
                        Impulsionar
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        )}
      </Container>
    </PageShell>
  )
}
