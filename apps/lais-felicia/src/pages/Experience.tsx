import { About } from '../components/About'
import { Courses } from '../components/Courses'
import { Desire } from '../components/Desire'
import { Faq } from '../components/Faq'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { Insta } from '../components/Insta'
import { Navbar } from '../components/Navbar'
import { PageProgress } from '../components/PageProgress'
import { Process } from '../components/Process'
import { PulseWhatsApp } from '../components/PulseWhatsApp'
import { Results } from '../components/Results'
import { Services } from '../components/Services'
import { Threshold } from '../components/Threshold'
import { Why } from '../components/Why'

export function Experience() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <a
        href="#servicos"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-rose focus:px-4 focus:py-2 focus:text-white"
      >
        Pular para os serviços
      </a>
      <PageProgress />
      <Navbar />
      <main>
        <Hero />
        <Desire />
        <Services />
        <Process />
        <Results />
        <Why />
        <About />
        <Courses />
        <Insta />
        <Faq />
        <Threshold />
      </main>
      <Footer />
      <PulseWhatsApp />
    </div>
  )
}
