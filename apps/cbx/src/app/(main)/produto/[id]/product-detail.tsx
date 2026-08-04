'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  Heart,
  Share2,
  Flag,
  BadgeCheck,
  Phone,
} from 'lucide-react'
import { toast } from 'sonner'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { ProductCard } from '@/components/cards/product-card'
import { PriceTag } from '@/components/ui/price-tag'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Rating } from '@/components/ui/rating'
import { IconButton } from '@/components/ui/icon-button'
import { BRAND, ROUTES } from '@/constants/brand'
import { productService, userService } from '@/services'
import { useAppStore } from '@/stores/app-store'
import type { Product } from '@/types'
import { staggerContainer, staggerItem } from '@/animations/variants'

const CONDITION_LABELS: Record<Product['condition'], string> = {
  novo: 'Novo',
  seminovo: 'Seminovo',
  usado: 'Usado',
}

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const router = useRouter()
  const [imageIndex, setImageIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const { addRecentView, toggleFavorite, isFavorite } = useAppStore()

  const seller = userService.get(product.sellerId)
  const related = productService.related(product.id).filter((p) => p.id !== product.id)
  const sellerProducts = productService
    .bySeller(product.sellerId)
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  useEffect(() => {
    addRecentView(product.id)
  }, [product.id, addRecentView])

  const goToImage = (next: number) => {
    setDirection(next > imageIndex ? 1 : -1)
    setImageIndex(next)
  }

  const prevImage = () => {
    const next = imageIndex === 0 ? product.images.length - 1 : imageIndex - 1
    goToImage(next)
  }

  const nextImage = () => {
    const next = imageIndex === product.images.length - 1 ? 0 : imageIndex + 1
    goToImage(next)
  }

  const whatsappUrl = seller
    ? `https://wa.me/55${seller.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Tenho interesse no anúncio "${product.title}" no CBX.`)}`
    : `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse no anúncio "${product.title}" no CBX.`)}`

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      try {
        await navigator.share({ title: product.title, url })
      } catch {
        toast.success('Link copiado para a área de transferência')
      }
    } else {
      await navigator.clipboard?.writeText(url)
      toast.success('Link copiado para a área de transferência')
    }
  }

  const handleReport = () => {
    toast.info('Denúncia registrada. Nossa equipe irá analisar em breve.')
  }

  return (
    <PageShell className="pb-28">
      <Container className="py-4 md:py-6">
        {/* Gallery */}
        <div className="relative mb-6 overflow-hidden rounded-2xl bg-muted">
          <div className="relative aspect-[4/3] md:aspect-[16/9]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={imageIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction * 80 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -80 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={product.images[imageIndex]}
                  alt={`${product.title} — imagem ${imageIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {product.images.length > 1 && (
              <>
                <IconButton
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm"
                  aria-label="Imagem anterior"
                  onClick={prevImage}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-card/80 backdrop-blur-sm"
                  aria-label="Próxima imagem"
                  onClick={nextImage}
                >
                  <ChevronRight />
                </IconButton>
              </>
            )}

            {product.sponsored && (
              <Badge variant="sponsored" className="absolute left-3 top-3">
                Patrocinado
              </Badge>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => goToImage(i)}
                  className={`relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                    i === imageIndex ? 'border-primary' : 'border-transparent opacity-70'
                  }`}
                  aria-label={`Ver imagem ${i + 1}`}
                  aria-current={i === imageIndex}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div>
              <PriceTag price={product.price} oldPrice={product.oldPrice} size="lg" />
              <h1 className="mt-3 text-xl font-bold tracking-tight text-foreground md:text-2xl">
                {product.title}
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="primary">{CONDITION_LABELS[product.condition]}</Badge>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="size-4" aria-hidden />
                  {product.neighborhood}, {product.city}
                </span>
              </div>
            </div>

            <section>
              <h2 className="mb-2 text-base font-semibold">Descrição</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
            </section>

            {Object.keys(product.specs).length > 0 && (
              <section>
                <h2 className="mb-3 text-base font-semibold">Especificações</h2>
                <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div
                      key={key}
                      className="rounded-xl border border-border/60 bg-muted/40 px-3 py-2.5"
                    >
                      <dt className="text-xs capitalize text-muted-foreground">{key}</dt>
                      <dd className="mt-0.5 text-sm font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <section>
              <h2 className="mb-3 text-base font-semibold">Localização</h2>
              <div className="relative h-48 overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-primary/5 via-muted to-accent/5">
                <div className="absolute inset-0 opacity-30">
                  <div className="grid h-full w-full grid-cols-6 grid-rows-4">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="border border-border/40" />
                    ))}
                  </div>
                </div>
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full">
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                  >
                    <MapPin className="size-10 fill-primary text-primary drop-shadow-md" />
                  </motion.div>
                </div>
                <div className="absolute bottom-3 left-3 rounded-lg bg-card/90 px-3 py-1.5 text-xs backdrop-blur-sm">
                  <span className="font-medium">{product.neighborhood}</span>
                  <span className="text-muted-foreground">
                    {' '}
                    · {product.location.lat.toFixed(4)}, {product.location.lng.toFixed(4)}
                  </span>
                </div>
              </div>
            </section>

            {related.length > 0 && (
              <section>
                <SectionHeader title="Produtos relacionados" />
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 gap-3 sm:grid-cols-3"
                >
                  {related.slice(0, 3).map((p) => (
                    <motion.div key={p.id} variants={staggerItem}>
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            {sellerProducts.length > 0 && (
              <section>
                <SectionHeader title="Mais do vendedor" />
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="grid grid-cols-2 gap-3 sm:grid-cols-4"
                >
                  {sellerProducts.map((p) => (
                    <motion.div key={p.id} variants={staggerItem}>
                      <ProductCard product={p} />
                    </motion.div>
                  ))}
                </motion.div>
              </section>
            )}

            <button
              type="button"
              onClick={handleReport}
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-danger"
            >
              <Flag className="size-4" aria-hidden />
              Denunciar anúncio
            </button>
          </div>

          {/* Seller card — desktop sidebar */}
          {seller && (
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <Link
                  href={ROUTES.vendedor(seller.id)}
                  className="flex items-center gap-3 transition-opacity hover:opacity-80"
                >
                  <Avatar src={seller.avatar} fallback={seller.name} size="lg" />
                  <div>
                    <p className="flex items-center gap-1 font-semibold">
                      {seller.name}
                      {seller.verified && (
                        <BadgeCheck className="size-4 text-primary" aria-label="Verificado" />
                      )}
                    </p>
                    <Rating value={seller.rating} count={seller.reviewCount} size="sm" />
                  </div>
                </Link>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{seller.bio}</p>
                <div className="mt-4 flex gap-2">
                  <Button className="flex-1" onClick={() => router.push(ROUTES.chat)}>
                    <MessageCircle className="size-4" />
                    Chat
                  </Button>
                  <Button variant="success" className="flex-1" asChild>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <Phone className="size-4" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </aside>
          )}
        </div>

        {/* Mobile seller card */}
        {seller && (
          <div className="mt-8 rounded-2xl border border-border/60 bg-card p-4 lg:hidden">
            <Link
              href={ROUTES.vendedor(seller.id)}
              className="flex items-center gap-3"
            >
              <Avatar src={seller.avatar} fallback={seller.name} size="md" />
              <div>
                <p className="flex items-center gap-1 font-semibold">
                  {seller.name}
                  {seller.verified && (
                    <BadgeCheck className="size-4 text-primary" aria-label="Verificado" />
                  )}
                </p>
                <Rating value={seller.rating} count={seller.reviewCount} size="sm" />
              </div>
            </Link>
          </div>
        )}
      </Container>

      {/* Sticky bottom actions */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-border/80 bg-card/95 p-3 backdrop-blur-xl md:bottom-0">
        <Container className="flex items-center gap-2 !px-0">
          <Button className="flex-1" onClick={() => router.push(ROUTES.chat)}>
            <MessageCircle className="size-4" />
            Chat
          </Button>
          <Button variant="success" className="flex-1" asChild>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <Phone className="size-4" />
              WhatsApp
            </a>
          </Button>
          <IconButton
            variant={isFavorite(product.id) ? 'soft' : 'outline'}
            aria-label={isFavorite(product.id) ? 'Remover dos favoritos' : 'Favoritar'}
            onClick={() => toggleFavorite(product.id)}
          >
            <Heart className={isFavorite(product.id) ? 'fill-current text-danger' : ''} />
          </IconButton>
          <IconButton variant="outline" aria-label="Compartilhar" onClick={handleShare}>
            <Share2 />
          </IconButton>
        </Container>
      </div>
    </PageShell>
  )
}
