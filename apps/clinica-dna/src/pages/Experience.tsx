import { CustomCursor } from '../components/CustomCursor'
import { LivingThread } from '../components/LivingThread'
import { OrbitNav } from '../components/OrbitNav'
import { Immersion } from '../components/Immersion'
import { Manifesto } from '../components/Manifesto'
import { Corridor } from '../components/Corridor'
import { Story } from '../components/Story'
import { Whispers } from '../components/Whispers'
import { Threshold } from '../components/Threshold'
import { Closing } from '../components/Closing'
import { PulseWhatsApp } from '../components/PulseWhatsApp'

export function Experience() {
  return (
    <div className="min-h-screen bg-void">
      <a
        href="#corredor"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-signal focus:px-4 focus:py-2 focus:text-void"
      >
        Pular para o corredor de cuidado
      </a>
      <CustomCursor />
      <LivingThread />
      <OrbitNav />
      <main>
        <Immersion />
        <Manifesto />
        <Corridor />
        <Story />
        <Whispers />
        <Threshold />
      </main>
      <Closing />
      <PulseWhatsApp />
    </div>
  )
}
