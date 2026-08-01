import { PageProgress } from '../components/PageProgress'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { Credo } from '../components/Credo'
import { Toys } from '../components/Toys'
import { Combos } from '../components/Combos'
import { Gallery } from '../components/Gallery'
import { Coverage } from '../components/Coverage'
import { Safety } from '../components/Safety'
import { Steps } from '../components/Steps'
import { Faq } from '../components/Faq'
import { Threshold } from '../components/Threshold'
import { Footer } from '../components/Footer'
import { PulseWhatsApp } from '../components/PulseWhatsApp'

export function Experience() {
  return (
    <div className="min-h-screen bg-navy text-paper">
      <a
        href="#brinquedos"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-sun focus:px-4 focus:py-2 focus:text-navy"
      >
        Pular para os brinquedos
      </a>
      <PageProgress />
      <Navbar />
      <main>
        <Hero />
        <Credo />
        <Toys />
        <Combos />
        <Gallery />
        <Coverage />
        <Safety />
        <Steps />
        <Faq />
        <Threshold />
      </main>
      <Footer />
      <PulseWhatsApp />
    </div>
  )
}
