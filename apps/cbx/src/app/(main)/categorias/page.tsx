'use client'

import { CategoryCard } from '@/components/cards/category-card'
import { Container, PageShell, SectionHeader } from '@/components/layout/page-shell'
import { StaggerGrid, StaggerItem, ScrollSection } from '@/components/home/scroll-section'
import { categoryService } from '@/services'

export default function CategoriasPage() {
  const categories = categoryService.list()

  return (
    <PageShell>
      <ScrollSection className="pt-6">
        <Container>
          <SectionHeader
            title="Todas as categorias"
            subtitle="Encontre o que você procura em Capão Bonito"
          />
          <StaggerGrid className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <StaggerItem key={cat.id}>
                <CategoryCard category={cat} />
              </StaggerItem>
            ))}
          </StaggerGrid>
        </Container>
      </ScrollSection>
    </PageShell>
  )
}
