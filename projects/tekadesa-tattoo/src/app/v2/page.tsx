import { About } from "@/components/sections/about";
import { Artist } from "@/components/sections/artist";
import { ArtistStory } from "@/components/sections/artist-story";
import { Contact } from "@/components/sections/contact";
import { CtaBand } from "@/components/sections/cta-band";
import { Footer } from "@/components/sections/footer";
import { Gallery } from "@/components/sections/gallery";
import { InstagramSection } from "@/components/sections/instagram";
import { Location } from "@/components/sections/location";
import { Navbar } from "@/components/sections/navbar";
import { Process } from "@/components/sections/process";
import { QuoteForm } from "@/components/sections/quote-form";
import { Services } from "@/components/sections/services";
import { Styles } from "@/components/sections/styles";
import { Testimonials } from "@/components/sections/testimonials";
import { WhatsAppFab } from "@/components/sections/whatsapp-fab";
import { LoadingScreen } from "@/components/artifacts/loading-screen";
import { VictorianHero } from "@/components/victorian/hero";
import { VictorianMarquee } from "@/components/victorian/marquee";

export default function VictorianHome() {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main>
        <VictorianHero />
        <About />
        <VictorianMarquee />
        <Gallery />
        <VictorianMarquee />
        <Services />
        <Styles />
        <VictorianMarquee />
        <Process />
        <Artist />
        <Testimonials />
        <ArtistStory />
        <QuoteForm />
        <InstagramSection />
        <Location />
        <Contact />
        <CtaBand />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
