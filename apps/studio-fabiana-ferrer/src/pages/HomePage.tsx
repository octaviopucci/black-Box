import { brand } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'
import CareStream from '@/components/CareStream'
import Evidence from '@/components/Evidence'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Nav from '@/components/Nav'
import Pillars from '@/components/Pillars'
import PulseInstagram from '@/components/PulseInstagram'
import Shell from '@/components/Shell'
import Space from '@/components/Space'
import Understand from '@/components/Understand'
import Visit from '@/components/Visit'

export default function HomePage() {
  usePageMeta(
    `${brand.short} · Laser e Estética · Sorocaba`,
    `${brand.inclusion} ${brand.promise}`,
  )

  return (
    <Shell>
      <Nav />
      <main>
        <Hero />
        <Pillars />
        <CareStream />
        <Evidence />
        <Space />
        <Understand />
        <Visit />
      </main>
      <Footer />
      <PulseInstagram />
    </Shell>
  )
}
