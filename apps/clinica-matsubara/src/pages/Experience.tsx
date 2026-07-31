import { CustomCursor } from '../components/CustomCursor'
import { PageProgress } from '../components/PageProgress'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { Versao } from '../components/Versao'
import { Rivers } from '../components/Rivers'
import { Espaco } from '../components/Espaco'
import { Equipe } from '../components/Equipe'
import { Instagram } from '../components/Instagram'
import { Whispers } from '../components/Whispers'
import { Threshold } from '../components/Threshold'
import { Footer } from '../components/Footer'
import { PulseWhatsApp } from '../components/PulseWhatsApp'

export function Experience() {
  return (
    <div className="min-h-screen">
      <a
        href="#cuidados"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-wine focus:px-4 focus:py-2 focus:text-cream"
      >
        Pular para cuidados
      </a>
      <CustomCursor />
      <PageProgress />
      <Navbar />
      <main>
        <Hero />
        <Versao />
        <Rivers />
        <Espaco />
        <Equipe />
        <Instagram />
        <Whispers />
        <Threshold />
      </main>
      <Footer />
      <PulseWhatsApp />
    </div>
  )
}
