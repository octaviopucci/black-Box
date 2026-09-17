import { CtaSection, Footer } from '@/components/sections/footer'
import { Essence } from '@/components/sections/essence'
import { Faq } from '@/components/sections/faq'
import { Feed } from '@/components/sections/feed'
import { Hero } from '@/components/sections/hero'
import { Navbar } from '@/components/sections/navbar'
import { Pillars } from '@/components/sections/pillars'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Essence />
        <Pillars />
        <Feed />
        <Faq />
        <CtaSection />
      </main>
      <Footer />
    </>
  )
}
