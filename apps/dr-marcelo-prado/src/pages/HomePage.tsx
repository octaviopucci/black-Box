import { Navbar } from '../components/Navbar'
import { Hero } from '../components/Hero'
import { Approach } from '../components/Approach'
import { CareAreas } from '../components/CareAreas'
import { Journey } from '../components/Journey'
import { Proof, Doctor } from '../components/Doctor'
import { Modalities } from '../components/Modalities'
import { Voices, Faq } from '../components/Voices'
import { Booking } from '../components/Booking'
import { Footer } from '../components/Footer'
import { BookingButton } from '../components/BookingButton'
import { CustomCursor } from '../components/CustomCursor'
import { useSmoothScroll } from '../hooks/useMotion'

export function HomePage() {
  useSmoothScroll()

  return (
    <div className="min-h-screen">
      <a
        href="#abordagem"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-signal focus:px-4 focus:py-2 focus:text-void"
      >
        Pular para abordagem
      </a>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Approach />
        <CareAreas />
        <Journey />
        <Proof />
        <Doctor />
        <Modalities />
        <Voices />
        <Faq />
        <Booking />
      </main>
      <Footer />
      <BookingButton />
    </div>
  )
}
