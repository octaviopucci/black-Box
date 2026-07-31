import { CustomCursor } from '../components/CustomCursor'
import { PageProgress } from '../components/PageProgress'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { Escuta } from '../components/Escuta'
import { Oficio } from '../components/Oficio'
import { Espaco } from '../components/Espaco'
import { Duo } from '../components/Duo'
import { Momentos } from '../components/Momentos'
import { Threshold } from '../components/Threshold'
import { Footer } from '../components/Footer'
import { PulseWhatsApp } from '../components/PulseWhatsApp'

export function Experience() {
  return (
    <div className="min-h-screen">
      <a
        href="#escuta"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-wine focus:px-4 focus:py-2 focus:text-cream"
      >
        Pular para a escuta
      </a>
      <CustomCursor />
      <PageProgress />
      <Navbar />
      <main>
        <Hero />
        <Escuta />
        <Oficio />
        <Espaco />
        <Duo />
        <Momentos />
        <Threshold />
      </main>
      <Footer />
      <PulseWhatsApp />
    </div>
  )
}
