import { Booking } from '@/components/Booking'
import { Clinic } from '@/components/Clinic'
import { Evidence } from '@/components/Evidence'
import { Footer } from '@/components/Footer'
import { Hero } from '@/components/Hero'
import { InstagramFeed } from '@/components/InstagramFeed'
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
        <InstagramFeed />
        <Booking />
      </main>
      <Footer />
      <PulseInstagram />
    </div>
  )
}
