import { About } from '@/components/About'
import { AreasOfActuation } from '@/components/AreasOfActuation'
import { Contact } from '@/components/Contact'
import { Hero } from '@/components/Hero'
import { Numbers } from '@/components/Numbers'
import { Registros } from '@/components/Registros'
import { Timeline } from '@/components/Timeline'

export function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Timeline />
      <Numbers />
      <AreasOfActuation />
      <Registros />
      <Contact />
    </>
  )
}
