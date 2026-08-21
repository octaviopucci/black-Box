import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Topics } from '@/components/Topics'
import { Approach } from '@/components/Approach'
import { Feed } from '@/components/Feed'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import { useSmoothScroll } from '@/hooks/useMotion'

export default function App() {
  useSmoothScroll()

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Topics />
        <Approach />
        <Feed />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
