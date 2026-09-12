import { Hero } from '../components/Hero'
import { Navbar } from '../components/Navbar'
import { Manifesto } from '../components/Manifesto'
import { Specialties } from '../components/Specialties'
import { Archive } from '../components/Archive'
import { Process } from '../components/Process'
import { Booking } from '../components/Booking'
import { Footer } from '../components/Footer'
import { PageProgress } from '../components/PageProgress'

export function Experience() {
  return (
    <div className="bg-obsidian text-parchment">
      <PageProgress />
      <Navbar />
      <main>
        <Hero />
        <Manifesto />
        <Specialties />
        <Archive />
        <Process />
        <Booking />
      </main>
      <Footer />
    </div>
  )
}
