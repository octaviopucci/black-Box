import { Navbar } from '../components/Navbar'
import { PageProgress } from '../components/PageProgress'
import { CustomCursor } from '../components/CustomCursor'
import { Ignition } from '../components/Ignition'
import { Hero } from '../components/Hero'
import { Truths } from '../components/Truths'
import { Garage } from '../components/Garage'
import { Entregas } from '../components/Entregas'
import { Negocio } from '../components/Negocio'
import { Loja } from '../components/Loja'
import { Contato } from '../components/Contato'
import { Footer } from '../components/Footer'
import { PulseWhatsApp } from '../components/PulseWhatsApp'

export function Experience() {
  return (
    <>
      <Ignition />
      <PageProgress />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Truths />
        <Garage />
        <Entregas />
        <Negocio />
        <Loja />
        <Contato />
      </main>
      <Footer />
      <PulseWhatsApp />
    </>
  )
}
