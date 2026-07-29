import { Atmosphere } from '../components/Atmosphere'
import { CustomCursor } from '../components/CustomCursor'
import { LivingPulse } from '../components/LivingPulse'
import { SectionRail } from '../components/SectionRail'
import { OrbitNav } from '../components/OrbitNav'
import { Immersion } from '../components/Immersion'
import { Manifesto } from '../components/Manifesto'
import { Corridor } from '../components/Corridor'
import { Story } from '../components/Story'
import { Protocol } from '../components/Protocol'
import { Whispers } from '../components/Whispers'
import { Threshold } from '../components/Threshold'
import { Closing } from '../components/Closing'
import { PulseBooking } from '../components/PulseBooking'

export function Experience() {
  return (
    <div className="relative min-h-screen bg-void">
      <a
        href="#corredor"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-signal focus:px-4 focus:py-2 focus:text-void"
      >
        Pular para o corredor de cuidado
      </a>
      <Atmosphere />
      <CustomCursor />
      <LivingPulse />
      <SectionRail />
      <OrbitNav />
      <main className="relative z-10">
        <Immersion />
        <Manifesto />
        <Corridor />
        <Story />
        <Protocol />
        <Whispers />
        <Threshold />
      </main>
      <Closing />
      <PulseBooking />
    </div>
  )
}
