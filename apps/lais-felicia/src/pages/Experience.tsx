import { About } from '../components/About'
import { Courses } from '../components/Courses'
import { Desire } from '../components/Desire'
import { Faq } from '../components/Faq'
import { Footer } from '../components/Footer'
import { Hero } from '../components/Hero'
import { Navbar } from '../components/Navbar'
import { PageProgress } from '../components/PageProgress'
import { ProcedureCorridor } from '../components/ProcedureCorridor'
import { PulseWhatsApp } from '../components/PulseWhatsApp'
import { ResultsCorridor } from '../components/ResultsCorridor'
import { Services } from '../components/Services'
import { Threshold } from '../components/Threshold'

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
        <ProcedureCorridor />
        <ResultsCorridor />
        <About />
        <Courses />
        <Faq />
        <Threshold />
      </main>
      <Footer />
      <PulseWhatsApp />
    </div>
  )
}
