import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import {
  ContactSection,
  InstagramFeedSection,
  ProceduresSection,
  ProfessionalSection,
  SpaceSection,
} from '@/components/LandingSections'
import { usePageMeta } from '@/lib/usePageMeta'

export default function HomePage() {
  usePageMeta(
    'Dra. Nathalia Rigo · Estética Avançada · Sorocaba',
    'Realçar sua beleza com resultados naturais e sofisticados. Criolipólise, preenchimento labial e laser no Parque São Bento.',
  )

  return (
    <main>
      <Hero />
      <ProceduresSection />
      <InstagramFeedSection />
      <ProfessionalSection />
      <SpaceSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
