import { useState } from 'react'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { PropertySearch, type SearchFilters } from '../components/PropertySearch'
import { FeaturedProperties, PropertyListings } from '../components/Listings'
import { Regions } from '../components/Regions'
import { Proof } from '../components/Proof'
import { Services } from '../components/Services'
import { Legacy } from '../components/Legacy'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { CustomCursor } from '../components/CustomCursor'
import { useSmoothScroll } from '../hooks/useMotion'

export function HomePage() {
  useSmoothScroll()
  const [filters, setFilters] = useState<SearchFilters>({
    ids: null,
    transaction: 'all',
  })

  return (
    <div className="min-h-screen">
      <a
        href="#buscar"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-gold focus:px-4 focus:py-2 focus:text-navy"
      >
        Pular para busca
      </a>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <PropertySearch onFilter={setFilters} />
        <FeaturedProperties filterIds={filters.ids} />
        <Proof />
        <Regions />
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

