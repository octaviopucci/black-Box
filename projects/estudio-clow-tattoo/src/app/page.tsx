import { About } from "@/components/sections/about";
import { Artist } from "@/components/sections/artist";
import { CtaBand } from "@/components/sections/cta-band";
import { Footer } from "@/components/sections/footer";
import { Gallery } from "@/components/sections/gallery";
import { Hero } from "@/components/sections/hero";
import { InstagramSection } from "@/components/sections/instagram";
import { Location } from "@/components/sections/location";
import { Navbar } from "@/components/sections/navbar";
import { Process } from "@/components/sections/process";
import { QuoteForm } from "@/components/sections/quote-form";
import { Styles } from "@/components/sections/styles";
import { Testimonials } from "@/components/sections/testimonials";
import { WhatsAppFab } from "@/components/sections/whatsapp-fab";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Gallery />
        <Styles />
        <Process />
        <Artist />
        <Testimonials />
        <QuoteForm />
        <InstagramSection />
        <Location />
        <CtaBand />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
