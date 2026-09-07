import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { Hero } from './components/sections/Hero'
import { SpecialtyMarquee } from './components/sections/SpecialtyMarquee'
import { ForWho } from './components/sections/ForWho'
import { Positioning } from './components/sections/Positioning'
import { Solutions } from './components/sections/Solutions'
import { Portfolio } from './components/sections/Portfolio'
import { Laboratory } from './components/sections/Laboratory'
import { Process } from './components/sections/Process'
import { Principles } from './components/sections/Principles'
import { AiChat } from './components/sections/AiChat'
import { About } from './components/sections/About'
import { FinalCta } from './components/sections/FinalCta'

export default function App() {
  return (
    <div className="relative min-h-screen">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[70] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink"
      >
        Ir para o conteúdo
      </a>
      <Navbar />
      <main id="conteudo">
        <Hero />
        <SpecialtyMarquee />
        <ForWho />
        <Positioning />
        <Solutions />
        <Portfolio />
        <Laboratory />
        <Process />
        <Principles />
        <AiChat />
        <About />
        <FinalCta />
      </main>
      <Footer />
    </div>
  )
}
