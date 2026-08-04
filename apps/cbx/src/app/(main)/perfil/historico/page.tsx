'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, Clock } from 'lucide-react'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { ROUTES } from '@/constants/brand'
import { productService, profileService } from '@/services'
import { useAppStore } from '@/stores/app-store'
import { formatCurrency } from '@/lib/utils'

export default function HistoricoPage() {
  const { recentViews } = useAppStore()
  const historyItems = profileService.history()

  const productIds = [
    ...new Set([...recentViews, ...historyItems.map((h) => h.productId)]),
  ]

  const products = productIds
    .map((id) => productService.get(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)

  return (
    <PageShell>
      <Container className="py-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
          <Link href={ROUTES.perfil}>
            <ChevronLeft className="mr-1 size-4" />
            Perfil
          </Link>
        </Button>
        <SectionHeader
          title="Histórico"
          subtitle="Produtos que você visualizou recentemente"
        />

        {products.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="Nenhum histórico"
            description="Os produtos que você visualizar aparecerão aqui."
            action={
              <Button asChild>
                <Link href={ROUTES.busca}>Explorar anúncios</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {products.map((product) => {
              const historyEntry = historyItems.find((h) => h.productId === product.id)
              return (
                <Link
                  key={product.id}
                  href={ROUTES.produto(product.id)}
                  className="flex gap-3 rounded-xl border border-border/60 bg-card p-3 transition-colors hover:bg-muted/30"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-medium">{product.title}</h3>
                    <p className="text-sm font-bold text-primary">
                      {formatCurrency(product.price)}
                    </p>
                    {historyEntry && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Visto em{' '}
                        {new Date(historyEntry.viewedAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </Container>
    </PageShell>
  )
}
