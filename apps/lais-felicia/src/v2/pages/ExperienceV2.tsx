import '../theme.css'
import { About } from '../components/About'
import { Courses } from '../components/Courses'
import { CustomCursor } from '../components/CustomCursor'
import { Divider } from '../components/Divider'
import { Faq } from '../components/Faq'
import { Footer } from '../components/Footer'
import { Gallery } from '../components/Gallery'
import { Hero } from '../components/Hero'
import { Navbar } from '../components/Navbar'
import { Preloader } from '../components/Preloader'
import { PriceTables } from '../components/PriceTables'
import { PulseWhatsApp } from '../components/PulseWhatsApp'
import { ScrollTop } from '../components/ScrollTop'
import { Services } from '../components/Services'
import { Stats } from '../components/Stats'
import { Testimonials } from '../components/Testimonials'

export function ExperienceV2() {
  return (
    <div className="theme-v2 min-h-screen bg-surface text-ink">
      <a
        href="#servicos"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:bg-gold focus:px-4 focus:py-2 focus:text-white"
      >
        Pular para os serviços
      </a>
      <Preloader />
      <CustomCursor />
      <ScrollTop />
      <Navbar />
      <main>
        <Hero />
        <Divider />
        <Services />
        <PriceTables />
        <Divider />
        <About />
        <Divider />
        <Stats />
        <Divider />
        <Courses />
        <Divider />
        <Gallery />
        <Divider />
        <Faq />
        <Divider />
        <Testimonials />
      </main>
      <Footer />
      <PulseWhatsApp />
    </div>
  )
}
