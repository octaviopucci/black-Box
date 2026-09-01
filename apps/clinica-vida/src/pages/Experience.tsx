import { PageProgress } from '../components/PageProgress'
import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { Essence } from '../components/Essence'
import { Score } from '../components/Score'
import { Space } from '../components/Space'
import { Faq } from '../components/Faq'
import { Threshold } from '../components/Threshold'
import { Footer } from '../components/Footer'
import { PulseWhatsApp } from '../components/PulseWhatsApp'

export function Experience() {
  return (
    <div className="min-h-screen">
      <a
        href="#especialidades"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-vida focus:px-4 focus:py-2 focus:text-paper"
      >
        Pular para especialidades
      </a>
      <PageProgress />
      <Navbar />
      <main>
        <Hero />
        <Essence />
        <Score />
        <Space />
        <Faq />
        <Threshold />
      </main>
      <Footer />
      <PulseWhatsApp />
    </div>
  )
}
