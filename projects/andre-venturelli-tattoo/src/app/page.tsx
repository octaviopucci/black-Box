import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { Gallery } from "@/components/sections/gallery";
import { Hero } from "@/components/sections/hero";
import { Location } from "@/components/sections/location";
import { Navbar } from "@/components/sections/navbar";
import { QuoteForm } from "@/components/sections/quote-form";
import { Styles } from "@/components/sections/styles";
import { Testimonials } from "@/components/sections/testimonials";
import { WhatsAppFab } from "@/components/sections/whatsapp-fab";
import { Marquee } from "@/components/ui/marquee";
import { site } from "@/data/site";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Marquee items={site.principles} />
        <Styles />
        <Gallery />
        <Testimonials />
        <Location />
        <QuoteForm />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
