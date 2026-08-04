import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ShoppingBag } from 'lucide-react'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/constants/brand'
import { profileService } from '@/services'
import { formatCurrency } from '@/lib/utils'
import type { Purchase } from '@/types'

const STATUS_LABEL: Record<Purchase['status'], string> = {
  concluida: 'Concluída',
  em_andamento: 'Em andamento',
  cancelada: 'Cancelada',
}

const STATUS_VARIANT: Record<Purchase['status'], 'success' | 'warning' | 'danger'> = {
  concluida: 'success',
  em_andamento: 'warning',
  cancelada: 'danger',
}

export default function ComprasPage() {
  const purchases = profileService.purchases()

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
          title="Minhas compras"
          subtitle={`${purchases.length} ${purchases.length === 1 ? 'compra' : 'compras'}`}
        />

        <div className="space-y-3">
          {purchases.map((purchase) => (
            <article
              key={purchase.id}
              className="flex gap-3 rounded-xl border border-border/60 bg-card p-3 sm:p-4"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-20">
                <Image
                  src={purchase.productImage}
                  alt={purchase.productTitle}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="line-clamp-2 text-sm font-medium sm:text-base">
                    {purchase.productTitle}
                  </h3>
                  <Badge variant={STATUS_VARIANT[purchase.status]}>
                    {STATUS_LABEL[purchase.status]}
                  </Badge>
                </div>
                <p className="mt-1 text-sm font-bold text-primary">
                  {formatCurrency(purchase.price)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Vendedor: {purchase.sellerName} ·{' '}
                  {new Date(purchase.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </article>
          ))}
        </div>

        {purchases.length === 0 && (
          <div className="py-12 text-center">
            <ShoppingBag className="mx-auto mb-3 size-12 text-muted-foreground/40" />
            <p className="text-muted-foreground">Você ainda não fez nenhuma compra.</p>
          </div>
        )}
      </Container>
    </PageShell>
  )
}
