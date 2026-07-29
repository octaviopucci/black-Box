import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { MarqueeStrip, Pathway } from '../components/Pathway'
import { FeaturedShowcase } from '../components/FeaturedShowcase'
import { FeaturedProperties } from '../components/FeaturedProperties'
import { type SearchFilters } from '../components/PropertySearch'
import { Rentals } from '../components/Rentals'
import { RuralHighlights } from '../components/RuralHighlights'
import { About } from '../components/About'
import { Financing } from '../components/Financing'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { WhatsAppButton } from '../components/WhatsAppButton'

export function HomePage() {
  const [filters, setFilters] = useState<SearchFilters>({
    ids: null,
    transaction: 'all',
  })

  const saleFilterIds =
    filters.ids === null ? null : filters.transaction === 'rent' ? [] : filters.ids

  const rentFilterIds =
    filters.ids === null ? null : filters.transaction === 'sale' ? [] : filters.ids

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <MarqueeStrip />
        <Pathway />
        <FeaturedShowcase />
        <FeaturedProperties filterIds={saleFilterIds} onFilter={setFilters} />
        <Rentals filterIds={rentFilterIds} />
        <RuralHighlights />
        <About />
        <Financing />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
