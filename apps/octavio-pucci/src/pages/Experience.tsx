import { CustomCursor } from '../components/CustomCursor'
import { PageProgress } from '../components/PageProgress'
import { NeedleRail } from '../components/NeedleRail'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { Credo } from '../components/Credo'
import { Languages } from '../components/Languages'
import { Archive } from '../components/Archive'
import { Ritual } from '../components/Ritual'
import { Studio } from '../components/Studio'
import { Threshold } from '../components/Threshold'
import { Footer } from '../components/Footer'
import { PulseWhatsApp } from '../components/PulseWhatsApp'

export function Experience() {
  return (
    <div className="min-h-screen bg-void text-bone">
      <a
        href="#arquivo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-gold focus:px-4 focus:py-2 focus:text-void"
      >
        Pular para o arquivo
      </a>
      <CustomCursor />
      <PageProgress />
      <NeedleRail />
      <Navbar />
      <main>
        <Hero />
        <Credo />
        <Languages />
        <Archive />
        <Ritual />
        <Studio />
        <Threshold />
      </main>
      <Footer />
      <PulseWhatsApp />
    </div>
  )
}
