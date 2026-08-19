import { Booking } from '@/components/Booking'
import { Clinic } from '@/components/Clinic'
import { Evidence } from '@/components/Evidence'
import { FeedStrip } from '@/components/FeedStrip'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { PulseInstagram } from '@/components/PulseInstagram'
import { Treatments } from '@/components/Treatments'

export default function App() {
  return (
    <div className="grain-overlay">
      <main>
        <Hero />
        <Treatments />
        <Clinic />
        <Evidence />
        <FeedStrip />
        <Booking />
      </main>
      <Footer />
      <PulseInstagram />
    </div>
  )
}
