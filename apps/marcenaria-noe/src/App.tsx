import { Ambientes } from '@/components/Ambientes'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { Navbar } from '@/components/Navbar'
import { PageProgress } from '@/components/PageProgress'
import { Portfolio } from '@/components/Portfolio'
import { Process } from '@/components/Process'
import { Statement } from '@/components/Statement'
import { WhatsAppButton } from '@/components/WhatsAppButton'

export default function App() {
  return (
    <>
      <PageProgress />
      <Navbar />
      <main>
        <Hero />
        <Statement />
        <Ambientes />
        <Portfolio />
        <Process />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
