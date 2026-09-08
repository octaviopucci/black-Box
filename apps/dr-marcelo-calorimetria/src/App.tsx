import { lazy, Suspense } from 'react'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Footer } from './components/Footer'
import { WhatsAppFloat } from './components/WhatsAppFloat'

const ProblemStatement = lazy(() =>
  import('./components/ProblemStatement').then((m) => ({ default: m.ProblemStatement })),
)
const EnergyBridge = lazy(() =>
  import('./components/EnergyBridge').then((m) => ({ default: m.EnergyBridge })),
)
const HowItWorks = lazy(() =>
  import('./components/HowItWorks').then((m) => ({ default: m.HowItWorks })),
)
const Readout = lazy(() => import('./components/Readout').then((m) => ({ default: m.Readout })))
const Audience = lazy(() => import('./components/Audience').then((m) => ({ default: m.Audience })))
const AboutDoctor = lazy(() =>
  import('./components/AboutDoctor').then((m) => ({ default: m.AboutDoctor })),
)
const Booking = lazy(() => import('./components/Booking').then((m) => ({ default: m.Booking })))
const FAQ = lazy(() => import('./components/FAQ').then((m) => ({ default: m.FAQ })))

function SectionFallback({ minH = '30vh' }: { minH?: string }) {
  return <div aria-hidden className="w-full" style={{ minHeight: minH }} />
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Suspense fallback={<SectionFallback minH="50vh" />}>
          <ProblemStatement />
          <EnergyBridge />
          <HowItWorks />
          <Readout />
          <Audience />
          <AboutDoctor />
          <Booking />
          <FAQ />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
