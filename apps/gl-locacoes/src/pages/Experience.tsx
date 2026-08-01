import { PageProgress } from '../components/PageProgress'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { Catalog } from '../components/Catalog'
import { Moments } from '../components/Moments'
import { HowItWorks } from '../components/HowItWorks'
import { Threshold } from '../components/Threshold'
import { Footer } from '../components/Footer'
import { PulseWhatsApp } from '../components/PulseWhatsApp'

export function Experience() {
  return (
    <div className="min-h-screen bg-night text-paper">
      <a
        href="#catalogo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-sun focus:px-4 focus:py-2 focus:text-night"
      >
        Pular para o catálogo
      </a>
      <PageProgress />
      <Navbar />
      <main>
        <Hero />
        <Catalog />
        <Moments />
        <HowItWorks />
        <Threshold />
      </main>
      <Footer />
      <PulseWhatsApp />
    </div>
  )
}
