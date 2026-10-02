import { Navbar, WhatsAppFab } from '@/components/sections/navbar'
import { Hero } from '@/components/sections/hero'
import { LifestylePinned } from '@/components/sections/lifestyle-pinned'
import { Features } from '@/components/sections/features'
import { Statement } from '@/components/sections/statement'
import { About } from '@/components/sections/about'
import { Pricing } from '@/components/sections/pricing'
import { Benefits } from '@/components/sections/benefits'
import { Support } from '@/components/sections/support'
import { Faq } from '@/components/sections/faq'
import { Testimonials } from '@/components/sections/testimonials'
import { FooterCta, Footer } from '@/components/sections/footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LifestylePinned />
        <Features />
        <Statement />
        <About />
        <Pricing />
        <Benefits />
        <Support />
        <Faq />
        <Testimonials />
        <FooterCta />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
