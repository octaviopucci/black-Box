import { About } from "@/components/sections/about";
import { ContactFab } from "@/components/sections/contact-fab";
import { CtaBand } from "@/components/sections/cta-band";
import { Editorial } from "@/components/sections/editorial";
import { Faq } from "@/components/sections/faq";
import { FirstConsult } from "@/components/sections/first-consult";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { InstagramFeed } from "@/components/sections/instagram-feed";
import { Location } from "@/components/sections/location";
import { Navbar } from "@/components/sections/navbar";
import { Philosophy } from "@/components/sections/philosophy";
import { Process } from "@/components/sections/process";
import { Proof } from "@/components/sections/proof";
import { Services } from "@/components/sections/services";
import { SmoothScroll } from "@/components/motion/smooth-scroll";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Navbar />
      <main>
        <Hero />
        <Proof />
        <About />
        <Philosophy />
        <Services />
        <Process />
        <FirstConsult />
        <Editorial />
        <InstagramFeed />
        <Faq />
        <Location />
        <CtaBand />
      </main>
      <Footer />
      <ContactFab />
    </>
  );
}
