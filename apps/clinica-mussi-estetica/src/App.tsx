import { Arrival } from '@/components/Arrival'
import { Care } from '@/components/Care'
import { Footer } from '@/components/Footer'
import { Gallery } from '@/components/Gallery'
import { Hero } from '@/components/Hero'
import { Presence } from '@/components/Presence'
import { PulseWhatsApp } from '@/components/PulseWhatsApp'
import { Team } from '@/components/Team'
import { Voices } from '@/components/Voices'

export default function App() {
  return (
    <div className="grain-overlay">
      <main>
        <Hero />
        <Presence />
        <Team />
        <Care />
        <Gallery />
        <Voices />
        <Arrival />
      </main>
      <Footer />
      <PulseWhatsApp />
    </div>
  )
}
