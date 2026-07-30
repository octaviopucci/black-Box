import { Navbar } from '../components/Navbar'
import { PageProgress } from '../components/PageProgress'
import { CustomCursor } from '../components/CustomCursor'
import { Hero } from '../components/Hero'
import { Manifesto } from '../components/Manifesto'
import { Pista } from '../components/Pista'
import { Entregas } from '../components/Entregas'
import { Negocio } from '../components/Negocio'
import { Loja } from '../components/Loja'
import { Contato } from '../components/Contato'
import { Footer } from '../components/Footer'
import { PulseWhatsApp } from '../components/PulseWhatsApp'

export function Experience() {
  return (
    <>
      <PageProgress />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <Manifesto />
        <Pista />
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
