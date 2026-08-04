'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Clock, TrendingUp } from 'lucide-react'

import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { SearchInput } from '@/components/ui/search-input'
import { Chip } from '@/components/ui/chip'
import { ROUTES } from '@/constants/brand'
import { categoryService, productService } from '@/services'
import { useAppStore } from '@/stores/app-store'
import { staggerContainer, staggerItem } from '@/animations/variants'

const RECENT_SEARCHES = ['iPhone', 'bicicleta', 'sofá', 'PlayStation', 'notebook']

const SUGGESTIONS = [
  'celular seminovo',
  'móveis usados',
  'bike aro 29',
  'videogame',
  'roupas bebê',
]

export default function BuscaPage() {
  const router = useRouter()
  const { setSearchQuery } = useAppStore()
  const [query, setQuery] = useState('')
  const categories = categoryService.list().slice(0, 6)
  const featured = productService.featured().slice(0, 4)

  const navigateToResults = (q: string) => {
    const trimmed = q.trim()
    if (!trimmed) return
    setSearchQuery(trimmed)
    router.push(`${ROUTES.resultados}?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <PageShell>
      <Container className="py-6">
        <SectionHeader
          title="Buscar"
          subtitle="Encontre o que precisa em Capão Bonito"
        />

        <SearchInput
          value={query}
          onValueChange={setQuery}
          onKeyDown={(e) => {
            if (e.key === 'Enter') navigateToResults(query)
          }}
          placeholder="O que você procura?"
          autoFocus
          className="mb-8"
        />

        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-8">
          <motion.section variants={staggerItem}>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Clock className="size-4" aria-hidden />
              Buscas recentes
            </div>
            <div className="flex flex-wrap gap-2">
              {RECENT_SEARCHES.map((term) => (
                <Chip key={term} onClick={() => navigateToResults(term)}>
                  {term}
                </Chip>
              ))}
            </div>
          </motion.section>

          <motion.section variants={staggerItem}>
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <TrendingUp className="size-4" aria-hidden />
              Categorias populares
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={ROUTES.categoria(cat.slug)}
                  className="group relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <span className="absolute bottom-2 left-2 text-sm font-semibold text-white">
                      {cat.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>

          <motion.section variants={staggerItem}>
            <SectionHeader title="Sugestões para você" />
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((term) => (
                <Chip key={term} onClick={() => navigateToResults(term)}>
                  {term}
                </Chip>
              ))}
            </div>
          </motion.section>

          <motion.section variants={staggerItem}>
            <SectionHeader title="Em destaque" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {featured.map((product) => (
                <Link
                  key={product.id}
                  href={ROUTES.produto(product.id)}
                  className="group overflow-hidden rounded-xl border border-border/60 bg-card"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={product.images[0]}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      sizes="25vw"
                    />
                  </div>
                  <p className="line-clamp-2 p-2 text-xs font-medium">{product.title}</p>
                </Link>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </Container>
    </PageShell>
  )
}
