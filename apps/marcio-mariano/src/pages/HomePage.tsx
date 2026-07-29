import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { PropertySearch, type SearchFilters } from '../components/PropertySearch'
import { FeaturedProperties, PropertyListings } from '../components/Listings'
import { Services } from '../components/Services'
import { Legacy } from '../components/Legacy'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { useSmoothScroll } from '../hooks/useMotion'

export function HomePage() {
  useSmoothScroll()
  const [filters, setFilters] = useState<SearchFilters>({
    ids: null,
    transaction: 'all',
  })

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <PropertySearch onFilter={setFilters} />
        <FeaturedProperties filterIds={filters.ids} />
        <PropertyListings filterIds={filters.ids} />
        <Services />
        <Legacy />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
