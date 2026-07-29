import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { PropertySearch } from './components/PropertySearch'
import { FeaturedProperties } from './components/FeaturedProperties'
import { RuralHighlights } from './components/RuralHighlights'
import { About } from './components/About'
import { Financing } from './components/Financing'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { WhatsAppButton } from './components/WhatsAppButton'

export default function App() {
  const [filterIds, setFilterIds] = useState<string[] | null>(null)

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <PropertySearch onFilter={setFilterIds} />
        <FeaturedProperties filterIds={filterIds} />
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
