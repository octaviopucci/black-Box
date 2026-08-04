import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Eye, Heart, MessageCircle, type LucideIcon } from 'lucide-react'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/brand'
import { productService } from '@/services'
import { productAdStaticParams } from '@/lib/static-params'

export function generateStaticParams() {
  return productAdStaticParams()
}

interface PageProps {
  params: Promise<{ id: string }>
}

function generateDailyData(productId: string, base: number, variance: number) {
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  return days.map((day, i) => {
    const seed = productId.charCodeAt(productId.length - 1) + i
    const value = Math.max(1, Math.round(base / 7 + (seed % variance) - variance / 2))
    return { day, value }
  })
}

function BarChart({
  title,
  icon: Icon,
  data,
  color,
}: {
  title: string
  icon: LucideIcon
  data: { day: string; value: number }[]
  color: string
}) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="size-5 text-primary" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="flex items-end justify-between gap-2" style={{ height: 120 }}>
        {data.map((d) => (
          <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
            <span className="text-xs font-medium text-muted-foreground">{d.value}</span>
            <div
              className="w-full rounded-t-md transition-all"
              style={{
                height: `${(d.value / max) * 100}%`,
                minHeight: 4,
                backgroundColor: color,
                opacity: 0.85,
              }}
            />
            <span className="text-[10px] text-muted-foreground">{d.day}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function EstatisticasPage({ params }: PageProps) {
  const { id } = await params
  const product = productService.get(id)

  if (!product) notFound()

  const viewsData = generateDailyData(id, product.views, 40)
  const favoritesData = generateDailyData(id, product.favorites, 8)
  const chatsData = generateDailyData(id, Math.round(product.views * 0.08), 5)

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
          title="Estatísticas"
          subtitle={product.title}
        />

        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
            <Eye className="mx-auto mb-1 size-5 text-primary" />
            <p className="text-xl font-bold">{product.views}</p>
            <p className="text-xs text-muted-foreground">Visualizações</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
            <Heart className="mx-auto mb-1 size-5 text-primary" />
            <p className="text-xl font-bold">{product.favorites}</p>
            <p className="text-xs text-muted-foreground">Favoritos</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
            <MessageCircle className="mx-auto mb-1 size-5 text-primary" />
            <p className="text-xl font-bold">{chatsData.reduce((s, d) => s + d.value, 0)}</p>
            <p className="text-xs text-muted-foreground">Chats (7 dias)</p>
          </div>
        </div>

        <div className="space-y-4">
          <BarChart title="Visualizações por dia" icon={Eye} data={viewsData} color="hsl(var(--primary))" />
          <BarChart title="Favoritos por dia" icon={Heart} data={favoritesData} color="hsl(var(--accent))" />
          <BarChart title="Conversas iniciadas" icon={MessageCircle} data={chatsData} color="hsl(var(--secondary))" />
        </div>

        <div className="mt-6">
          <Button asChild variant="outline">
            <Link href={ROUTES.impulsionar(id)}>Impulsionar este anúncio</Link>
          </Button>
        </div>
      </Container>
    </PageShell>
  )
}
