import { Navbar } from '@/components/Navbar'
import { Hero } from '@/components/Hero'
import { Manifesto } from '@/components/Manifesto'
import { ResultsCorridor } from '@/components/ResultsCorridor'
import { Specialties } from '@/components/Specialties'
import { Testimonial } from '@/components/Testimonial'
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
        <Manifesto />
        <ResultsCorridor />
        <Specialties />
        <Testimonial />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
