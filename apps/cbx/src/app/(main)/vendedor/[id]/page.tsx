import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  BadgeCheck,
  Calendar,
  MapPin,
  Package,
  ShoppingBag,
  Phone,
} from 'lucide-react'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { ProductCard } from '@/components/cards/product-card'
import { Avatar } from '@/components/ui/avatar'
import { Rating } from '@/components/ui/rating'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/brand'
import { productService, reviewService, userService } from '@/services'
import { SellerReviews } from './seller-reviews'

export function generateStaticParams() {
  return userService.list().map((user) => ({ id: user.id }))
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function VendedorPage({ params }: PageProps) {
  const { id } = await params
  const seller = userService.get(id)

  if (!seller) notFound()

  const products = productService.bySeller(seller.id)
  const reviews = reviewService.byTarget(seller.id)

  const memberSince = new Date(seller.memberSince).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <PageShell>
      <div className="relative h-36 bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/20 md:h-48">
        <Image
          src={`https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop&sig=${seller.id}`}
          alt=""
          fill
          className="object-cover opacity-60"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <Container className="-mt-14 relative pb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
          <Avatar
            src={seller.avatar}
            fallback={seller.name}
            size="xl"
            className="ring-4 ring-card shadow-lg"
          />
          <div className="flex-1">
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              {seller.name}
              {seller.verified && (
                <BadgeCheck className="size-6 text-primary" aria-label="Verificado" />
              )}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <Rating value={seller.rating} count={seller.reviewCount} />
              {seller.phoneVerified && (
                <Badge variant="success">Telefone verificado</Badge>
              )}
              {seller.verified && <Badge variant="primary">Perfil verificado</Badge>}
            </div>
            <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="size-4" aria-hidden />
              {seller.city}, {seller.state}
            </p>
          </div>
          <Button asChild>
            <Link href={ROUTES.chat}>
              Enviar mensagem
            </Link>
          </Button>
        </div>

        {seller.bio && (
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{seller.bio}</p>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
            <ShoppingBag className="mx-auto mb-1 size-5 text-primary" aria-hidden />
            <p className="text-lg font-bold">{seller.salesCount}</p>
            <p className="text-xs text-muted-foreground">Vendas</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
            <Package className="mx-auto mb-1 size-5 text-primary" aria-hidden />
            <p className="text-lg font-bold">{seller.adsCount}</p>
            <p className="text-xs text-muted-foreground">Anúncios</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
            <Calendar className="mx-auto mb-1 size-5 text-primary" aria-hidden />
            <p className="text-sm font-bold capitalize">{memberSince}</p>
            <p className="text-xs text-muted-foreground">Membro desde</p>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-4 text-center">
            <Phone className="mx-auto mb-1 size-5 text-primary" aria-hidden />
            <p className="text-sm font-bold">{seller.phone}</p>
            <p className="text-xs text-muted-foreground">Contato</p>
          </div>
        </div>

        <section className="mt-10">
          <SectionHeader
            title="Anúncios do vendedor"
            subtitle={`${products.length} ${products.length === 1 ? 'produto' : 'produtos'}`}
          />
          {products.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum anúncio ativo no momento.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10">
          <SectionHeader
            title="Avaliações"
            subtitle={`${reviews.length} ${reviews.length === 1 ? 'avaliação' : 'avaliações'}`}
          />
          <SellerReviews reviews={reviews} />
        </section>
      </Container>
    </PageShell>
  )
}
