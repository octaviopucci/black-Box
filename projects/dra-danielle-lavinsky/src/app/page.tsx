import { About } from "@/components/sections/about";
import { CtaBand } from "@/components/sections/cta-band";
import { DtmExplainer } from "@/components/sections/dtm-explainer";
import { Faq } from "@/components/sections/faq";
import { FirstConsult } from "@/components/sections/first-consult";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { InstagramFeed } from "@/components/sections/instagram-feed";
import { Location } from "@/components/sections/location";
import { Navbar } from "@/components/sections/navbar";
import { Process } from "@/components/sections/process";
import { Proof } from "@/components/sections/proof";
import { Reviews } from "@/components/sections/reviews";
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
        <Proof />
        <About />
        <DtmExplainer />
        <Services />
        <Process />
        <FirstConsult />
        <Reviews />
        <InstagramFeed />
        <Faq />
        <Location />
        <CtaBand />
      </main>
      <Footer />
      <WhatsappFab />
    </>
  );
}
