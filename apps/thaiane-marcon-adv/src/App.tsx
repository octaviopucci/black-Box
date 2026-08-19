import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'
import { Gallery } from '@/components/Gallery'
import { Hero } from '@/components/Hero'
import { Intro } from '@/components/Intro'
import { Nav } from '@/components/Nav'
import { Practice } from '@/components/Practice'
import { Presence } from '@/components/Presence'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Intro />
        <Practice />
        <Presence />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
