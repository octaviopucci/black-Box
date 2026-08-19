import { brand } from '@/data/site'
import { usePageMeta } from '@/lib/usePageMeta'
import Cuidados from '@/components/Cuidados'
import Evidence from '@/components/Evidence'
import Footer from '@/components/Footer'
import Hero from '@/components/Hero'
import Manifesto from '@/components/Manifesto'
import Nav from '@/components/Nav'
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
        <Manifesto />
        <Cuidados />
        <Evidence />
        <Space />
        <Understand />
        <Visit />
      </main>
      <Footer />
    </Shell>
  )
}
