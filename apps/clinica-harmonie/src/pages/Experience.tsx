import { CustomCursor } from '../components/CustomCursor'
import { PageProgress } from '../components/PageProgress'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { Essence } from '../components/Essence'
import { Score } from '../components/Score'
import { Protocol } from '../components/Protocol'
import { Space } from '../components/Space'
import { Team } from '../components/Team'
import { Whispers } from '../components/Whispers'
import { Threshold } from '../components/Threshold'
import { Footer } from '../components/Footer'
import { PulseWhatsApp } from '../components/PulseWhatsApp'

export function Experience() {
  return (
    <div className="min-h-screen">
      <a
        href="#cuidados"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
      >
        Pular para cuidados
      </a>
      <CustomCursor />
      <PageProgress />
      <Navbar />
      <main>
        <Hero />
        <Essence />
        <Score />
        <Protocol />
        <Space />
        <Team />
        <Whispers />
        <Threshold />
      </main>
      <Footer />
      <PulseWhatsApp />
    </div>
  )
}
