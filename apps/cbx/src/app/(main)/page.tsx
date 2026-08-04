'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Crown, ChevronRight } from 'lucide-react'

import { BrandBanner } from '@/components/brand/brand-assets'
import { HorizontalAd, PromoBanner } from '@/components/banners/hero-banner'
import { CategoryCard } from '@/components/cards/category-card'
import { CompanyCard } from '@/components/cards/company-card'
import { ProductCard } from '@/components/cards/product-card'
import { StoreCard } from '@/components/cards/store-card'
import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import {
  HorizontalScroll,
  ScrollSection,
  StaggerGrid,
  StaggerItem,
} from '@/components/home/scroll-section'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/brand'
import {
  categoryService,
  companyService,
  contentService,
  productService,
  storeService,
} from '@/services'
import { useAppStore } from '@/stores/app-store'
import { scaleIn } from '@/animations/variants'

function VerTodosLink({ href, label = 'Ver todos' }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-0.5 text-sm font-semibold text-primary hover:underline"
    >
      {label}
      <ChevronRight className="size-4" aria-hidden />
    </Link>
  )
}

export default function HomePage() {
  const { isFavorite, toggleFavorite, recentViews } = useAppStore()

  const categories = categoryService.list()
  const promotions = contentService.promotions()
  const allProducts = productService.list()
  const sponsored = productService.sponsored()
  const recent = productService.recent(8)
  const mostViewed = productService.mostViewed(8)
  const nearby = allProducts.slice(0, 8)
  const offers = allProducts.filter((p) => p.oldPrice).slice(0, 8)
  const stores = storeService.list()
  const companies = companyService.list()

  const recentlyViewed = recentViews
    .map((id) => productService.get(id))
    .filter((p): p is NonNullable<typeof p> => p != null)

  const favoriteProps = (id: string) => ({
    favorited: isFavorite(id),
    onFavoriteToggle: toggleFavorite,
  })

  return (
    <PageShell className="pb-8">
      {/* Categories */}
      <ScrollSection className="pt-4">
        <Container>
          <SectionHeader
            title="Categorias"
            subtitle="Explore por tipo de produto"
            action={<VerTodosLink href={ROUTES.categorias} />}
          />
          <HorizontalScroll>
            {categories.map((cat) => (
              <StaggerItem key={cat.id}>
                <CategoryCard category={cat} className="w-44 shrink-0" />
              </StaggerItem>
            ))}
          </HorizontalScroll>
        </Container>
      </ScrollSection>

      {/* Official brand banner */}
      <ScrollSection className="pt-2">
        <Container>
          <BrandBanner priority className="shadow-xl shadow-primary/10" />
        </Container>
      </ScrollSection>

      {/* Promotions */}
      <ScrollSection>
        <Container>
          <SectionHeader title="Promoções" subtitle="Ofertas especiais da região" />
          <HorizontalScroll>
            {promotions.map((promo) => (
              <StaggerItem key={promo.id}>
                <PromoBanner
                  title={promo.title}
                  subtitle={promo.discount}
                  href={ROUTES.busca}
                  className="w-72 shrink-0"
                />
              </StaggerItem>
            ))}
          </HorizontalScroll>
        </Container>
      </ScrollSection>

      {/* Nearby products */}
      <ScrollSection>
        <Container>
          <SectionHeader
            title="Produtos próximos"
            subtitle="Anúncios perto de você em Capão Bonito"
            action={<VerTodosLink href={ROUTES.busca} />}
          />
          <StaggerGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
            {nearby.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} {...favoriteProps(p.id)} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </Container>
      </ScrollSection>

      {/* Sponsored */}
      <ScrollSection>
        <Container>
          <SectionHeader
            title="Patrocinados"
            subtitle="Anúncios em destaque"
            action={<VerTodosLink href={ROUTES.busca} label="Ver mais" />}
          />
          <HorizontalScroll>
            {sponsored.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} className="w-44 shrink-0" {...favoriteProps(p.id)} />
              </StaggerItem>
            ))}
          </HorizontalScroll>
        </Container>
      </ScrollSection>

      {/* Recent */}
      <ScrollSection>
        <Container>
          <SectionHeader
            title="Recentes"
            subtitle="Publicados há pouco"
            action={<VerTodosLink href={ROUTES.busca} />}
          />
          <HorizontalScroll>
            {recent.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} className="w-44 shrink-0" {...favoriteProps(p.id)} />
              </StaggerItem>
            ))}
          </HorizontalScroll>
        </Container>
      </ScrollSection>

      {/* Most viewed */}
      <ScrollSection>
        <Container>
          <SectionHeader
            title="Mais vistos"
            subtitle="Os anúncios que todo mundo está vendo"
            action={<VerTodosLink href={ROUTES.busca} />}
          />
          <StaggerGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
            {mostViewed.map((p) => (
              <StaggerItem key={p.id}>
                <ProductCard product={p} {...favoriteProps(p.id)} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </Container>
      </ScrollSection>

      {/* Stores */}
      <ScrollSection>
        <Container>
          <SectionHeader
            title="Lojas"
            subtitle="Compre nas lojas parceiras"
            action={<VerTodosLink href={ROUTES.lojas} />}
          />
          <HorizontalScroll>
            {stores.map((store) => (
              <StaggerItem key={store.id}>
                <StoreCard store={store} className="w-64 shrink-0" />
              </StaggerItem>
            ))}
          </HorizontalScroll>
        </Container>
      </ScrollSection>

      {/* Companies */}
      <ScrollSection>
        <Container>
          <SectionHeader
            title="Empresas"
            subtitle="Negócios locais verificados"
            action={<VerTodosLink href={ROUTES.empresas} />}
          />
          <HorizontalScroll>
            {companies.map((company) => (
              <StaggerItem key={company.id}>
                <CompanyCard company={company} />
              </StaggerItem>
            ))}
          </HorizontalScroll>
        </Container>
      </ScrollSection>

      {/* Offers */}
      {offers.length > 0 && (
        <ScrollSection>
          <Container>
            <SectionHeader
              title="Ofertas"
              subtitle="Produtos com desconto"
              action={<VerTodosLink href={ROUTES.busca} />}
            />
            <StaggerGrid className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 md:gap-4">
              {offers.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} {...favoriteProps(p.id)} />
                </StaggerItem>
              ))}
            </StaggerGrid>
          </Container>
        </ScrollSection>
      )}

      {/* Recently viewed */}
      {recentlyViewed.length > 0 && (
        <ScrollSection>
          <Container>
            <SectionHeader title="Últimos vistos" subtitle="Continue de onde parou" />
            <HorizontalScroll>
              {recentlyViewed.map((p) => (
                <StaggerItem key={p.id}>
                  <ProductCard product={p} className="w-44 shrink-0" {...favoriteProps(p.id)} />
                </StaggerItem>
              ))}
            </HorizontalScroll>
          </Container>
        </ScrollSection>
      )}

      {/* Premium CTA */}
      <ScrollSection>
        <Container>
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-[#7c3aed] to-accent p-6 text-white shadow-xl md:p-8"
          >
            <div className="relative z-10 max-w-lg">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
                <Crown className="size-3.5" aria-hidden />
                CBX Premium
              </div>
              <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
                Destaque seus anúncios e venda mais rápido
              </h2>
              <p className="mt-2 text-sm text-white/85 md:text-base">
                Planos a partir de R$ 0. Impulsione seus produtos e alcance mais compradores em
                Capão Bonito.
              </p>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="mt-5 bg-white text-primary hover:bg-white/90"
              >
                <Link href={ROUTES.planos}>
                  Conhecer planos
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Button>
            </div>
            <div
              className="pointer-events-none absolute -right-12 -top-12 size-48 rounded-full bg-white/10 blur-3xl"
              aria-hidden
            />
          </motion.div>
        </Container>
      </ScrollSection>

      {/* Ad */}
      <ScrollSection className="pb-4">
        <Container>
          <HorizontalAd />
        </Container>
      </ScrollSection>
    </PageShell>
  )
}
