import { EnergyBridge } from './components/EnergyBridge'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { ProblemStatement } from './components/ProblemStatement'
import { HowItWorks } from './components/HowItWorks'
import { Readout } from './components/Readout'
import { Audience } from './components/Audience'
import { AboutDoctor } from './components/AboutDoctor'
import { Booking } from './components/Booking'
import { FAQ } from './components/FAQ'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProblemStatement />
        <EnergyBridge />
        <HowItWorks />
        <Readout />
        <Audience />
        <AboutDoctor />
        <Booking />
        <FAQ />
      </main>
      <Footer />
    </>
  )
}
