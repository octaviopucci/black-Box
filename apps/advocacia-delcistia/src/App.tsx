import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { PracticeAreas } from '@/components/PracticeAreas'
import { Team } from '@/components/Team'
import { Commitment } from '@/components/Commitment'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <PracticeAreas />
        <Team />
        <Commitment />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
