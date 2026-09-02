import { About } from "@/components/sections/about";
import { CtaBand } from "@/components/sections/cta-band";
import { Experience } from "@/components/sections/experience";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Navbar } from "@/components/sections/navbar";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { WhatsappFab } from "@/components/sections/whatsapp-fab";
import { SmoothScroll } from "@/components/motion/smooth-scroll";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Process />
        <Experience />
        <Faq />
        <CtaBand />
      </main>
      <Footer />
      <WhatsappFab />
    </>
  );
}
