import { Contact } from '@/components/Contact'
import { Doctor } from '@/components/Doctor'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { InstagramButton } from '@/components/InstagramButton'
import { Navbar } from '@/components/Navbar'
import { PageProgress } from '@/components/PageProgress'
import { Philosophy } from '@/components/Philosophy'
import { Results } from '@/components/Results'
import { Treatments } from '@/components/Treatments'

export default function App() {
  return (
    <>
      <PageProgress />
      <Navbar />
      <main>
        <Hero />
        <Philosophy />
        <Treatments />
        <Results />
        <Doctor />
        <Contact />
      </main>
      <Footer />
      <InstagramButton />
    </>
  )
}
