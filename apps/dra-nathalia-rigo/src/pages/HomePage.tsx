import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import {
  BrandIntroSection,
  ContactSection,
  ProceduresSection,
  ProfessionalSection,
  ResultsSection,
  SpaceSection,
} from '@/components/LandingSections'
import { usePageMeta } from '@/lib/usePageMeta'

export default function HomePage() {
  usePageMeta(
    'Dra. Nathalia Rigo · Estética & Saúde · Sorocaba',
    'Procedimentos estéticos com naturalidade. Preenchimento labial e facial, criolipólise e laser. COREN 387004 · Parque São Bento.',
  )

  return (
    <main className="pb-20 md:pb-0">
      <Hero />
      <BrandIntroSection />
      <ProceduresSection />
      <ResultsSection />
      <ProfessionalSection />
      <SpaceSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
