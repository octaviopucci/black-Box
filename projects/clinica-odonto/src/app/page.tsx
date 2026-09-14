import { Faq } from "@/components/sections/faq"
import { Features } from "@/components/sections/features"
import { Footer } from "@/components/sections/footer"
import { Hero } from "@/components/sections/hero"
import { Navbar } from "@/components/sections/navbar"
import { Testimonials } from "@/components/sections/testimonials"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </>
  )
}
