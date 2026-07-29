import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { PropertySearch, type SearchFilters } from './components/PropertySearch'
import { FeaturedProperties } from './components/FeaturedProperties'
import { Rentals } from './components/Rentals'
import { RuralHighlights } from './components/RuralHighlights'
import { About } from './components/About'
import { Financing } from './components/Financing'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { WhatsAppButton } from './components/WhatsAppButton'

export default function App() {
  const [filters, setFilters] = useState<SearchFilters>({
    ids: null,
    transaction: 'all',
  })

  const saleFilterIds =
    filters.ids === null
      ? null
      : filters.transaction === 'rent'
        ? []
        : filters.ids

  const rentFilterIds =
    filters.ids === null
      ? null
      : filters.transaction === 'sale'
        ? []
        : filters.ids

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <PropertySearch onFilter={setFilters} />
        <FeaturedProperties filterIds={saleFilterIds} />
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
