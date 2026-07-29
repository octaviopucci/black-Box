import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { Marquee } from '../components/Testimonials'
import { Specialties } from '../components/Specialties'
import { Journey } from '../components/Journey'
import { Proof } from '../components/Proof'
import { About } from '../components/About'
import { Testimonials } from '../components/Testimonials'
import { Faq } from '../components/Faq'
import { Contact } from '../components/Contact'
import { Footer } from '../components/Footer'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { CustomCursor } from '../components/CustomCursor'
import { useSmoothScroll } from '../hooks/useMotion'

export function HomePage() {
  useSmoothScroll()

  return (
    <div className="min-h-screen">
      <a
        href="#especialidades"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-aqua focus:px-4 focus:py-2 focus:text-abyss"
      >
        Pular para especialidades
      </a>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Specialties />
        <Journey />
        <Proof />
        <About />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
