import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  BadgeCheck,
  MapPin,
  MessageCircle,
  Phone,
  Store as StoreIcon,
} from 'lucide-react'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { ProductCard } from '@/components/cards/product-card'
import { Rating } from '@/components/ui/rating'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/brand'
import { storeService } from '@/services'
import { products } from '@/mocks'

export function generateStaticParams() {
  return storeService.list().map((store) => ({ id: store.id }))
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function LojaPage({ params }: PageProps) {
  const { id } = await params
  const store = storeService.get(id)

  if (!store) notFound()

  const catalog = products.filter((p) => p.storeId === store.id && p.status === 'ativo')

  return (
    <PageShell>
      <div className="relative h-40 bg-muted md:h-52">
        {store.cover && (
          <Image
            src={store.cover}
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <Container className="-mt-12 relative pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border-4 border-card bg-card shadow-lg sm:size-24">
            {store.logo ? (
              <Image src={store.logo} alt={store.name} fill className="object-cover" sizes="96px" />
            ) : (
              <div className="flex size-full items-center justify-center bg-muted">
                <StoreIcon className="size-8 text-primary" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              {store.name}
              {store.verified && (
                <BadgeCheck className="size-6 text-primary" aria-label="Loja verificada" />
              )}
            </h1>
            <p className="text-sm text-muted-foreground">{store.category}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Rating value={store.rating} count={store.reviewCount} />
              <Badge variant="neutral">{store.productCount} produtos</Badge>
              {store.verified && <Badge variant="success">Verificada</Badge>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={`https://wa.me/55${store.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-1 size-4" />
                WhatsApp
              </a>
            </Button>
            <Button asChild size="sm">
              <Link href={ROUTES.chat}>Mensagem</Link>
            </Button>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{store.description}</p>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-4" />
            {store.address}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="size-4" />
            {store.phone}
          </span>
        </div>

        <section className="mt-10">
          <SectionHeader
            title="Catálogo"
            subtitle={`${catalog.length} ${catalog.length === 1 ? 'produto' : 'produtos'} disponíveis`}
          />
          {catalog.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum produto no catálogo no momento.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {catalog.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </Container>
    </PageShell>
  )
}
