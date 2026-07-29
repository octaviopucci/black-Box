import { startTransition, useState } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { ServiceSearch } from './components/ServiceSearch'
import { PopularServices } from './components/PopularServices'
import { Profiles } from './components/Profiles'
import { Journey } from './components/Journey'
import { Trust } from './components/Trust'
import { Footer } from './components/Footer'
import type { Service } from './data/site'

export default function App() {
  const [selected, setSelected] = useState<Service | null>(null)
  const [category, setCategory] = useState<string | null>(null)
  const [profileId, setProfileId] = useState<string | null>('familia')

  const selectService = (service: Service) => {
    startTransition(() => {
      setSelected(service)
    })
    requestAnimationFrame(() => {
      document.getElementById('jornada')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <ServiceSearch onSelect={selectService} selectedId={selected?.id ?? null} />
        <PopularServices
          onSelect={selectService}
          activeCategory={category}
          setActiveCategory={setCategory}
        />
        <Profiles
          activeId={profileId}
          onSelectProfile={setProfileId}
          onSelectService={selectService}
        />
        <Journey service={selected} />
        <Trust />
      </main>
      <Footer />
    </div>
  )
}
