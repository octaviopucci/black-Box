import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { Care } from '@/components/Care'
import { Transformation } from '@/components/Transformation'
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
        <Care />
        <Transformation />
        <InstagramFeed />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  )
}
