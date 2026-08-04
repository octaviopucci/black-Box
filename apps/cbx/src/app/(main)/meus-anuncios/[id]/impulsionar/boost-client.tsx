'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, ChevronLeft, Rocket, Sparkles, Star, Zap } from 'lucide-react'
import { toast } from 'sonner'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ROUTES } from '@/constants/brand'
import { formatCurrency, cn } from '@/lib/utils'
import type { Product } from '@/types'

const BOOST_OPTIONS = [
  {
    id: 'destaque-7',
    name: 'Destaque 7 dias',
    price: 19.9,
    icon: Star,
    description: 'Seu anúncio aparece no topo das buscas por 7 dias.',
    features: ['Posição privilegiada', 'Selo "Em destaque"', 'Até 3x mais visualizações'],
  },
  {
    id: 'destaque-15',
    name: 'Destaque 15 dias',
    price: 34.9,
    icon: Sparkles,
    description: 'Máxima visibilidade por duas semanas completas.',
    features: ['Topo das buscas', 'Banner na categoria', 'Relatório de desempenho'],
    popular: true,
  },
  {
    id: 'turbo-3',
    name: 'Turbo 3 dias',
    price: 9.9,
    icon: Zap,
    description: 'Impulso rápido para vender com urgência.',
    features: ['Destaque por 3 dias', 'Notificação para interessados', 'Ideal para promoções'],
  },
]

export function BoostOptions({ product }: { product: Product }) {
  const [selected, setSelected] = useState('destaque-15')
  const [loading, setLoading] = useState(false)
  const option = BOOST_OPTIONS.find((o) => o.id === selected)!

  const handleBoost = async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    toast.success(`Anúncio impulsionado com ${option.name}!`)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {BOOST_OPTIONS.map((opt) => {
          const Icon = opt.icon
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelected(opt.id)}
              className={cn(
                'relative w-full rounded-xl border p-4 text-left transition-colors',
                selected === opt.id
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20'
                  : 'border-border/60 bg-card hover:border-primary/40',
              )}
            >
              {opt.popular && (
                <Badge variant="primary" className="absolute right-4 top-4">
                  Mais escolhido
                </Badge>
              )}
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1 pr-20">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-semibold">{opt.name}</h3>
                    <span className="font-bold text-primary">{formatCurrency(opt.price)}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{opt.description}</p>
                  <ul className="mt-2 space-y-1">
                    {opt.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Check className="size-3 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div className="rounded-xl border border-border/60 bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">
          Anúncio selecionado: <strong className="text-foreground">{product.title}</strong>
        </p>
        <p className="mt-1 text-lg font-bold text-primary">
          Total: {formatCurrency(option.price)}
        </p>
      </div>

      <Button onClick={handleBoost} disabled={loading} className="w-full sm:w-auto">
        <Rocket className="mr-2 size-4" />
        {loading ? 'Processando...' : 'Impulsionar agora'}
      </Button>
    </div>
  )
}

export function BoostPageShell({
  product,
  children,
}: {
  product: Product
  children: React.ReactNode
}) {
  return (
    <PageShell>
      <Container className="py-6">
        <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2">
          <Link href={ROUTES.meusAnuncios}>
            <ChevronLeft className="mr-1 size-4" />
            Meus anúncios
          </Link>
        </Button>
        <SectionHeader
          title="Impulsionar anúncio"
          subtitle={product.title}
        />
        {children}
      </Container>
    </PageShell>
  )
}
