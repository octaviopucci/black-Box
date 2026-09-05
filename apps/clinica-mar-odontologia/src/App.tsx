import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Care } from '@/components/Care'
import { Process } from '@/components/Process'
import { Education } from '@/components/Education'
import { Transformation } from '@/components/Transformation'
import { Campaign } from '@/components/Campaign'
import { InstagramFeed } from '@/components/InstagramFeed'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import { WhatsAppFab } from '@/components/WhatsAppFab'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Care />
        <Process />
        <Education />
        <Transformation />
        <Campaign />
        <InstagramFeed />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
