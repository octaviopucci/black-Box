import { About } from "@/components/sections/about";
import { Artist } from "@/components/sections/artist";
import { ArtistStory } from "@/components/sections/artist-story";
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
import { PrinciplesMarquee } from "@/components/home-marquees";
import { LoadingScreen } from "@/components/artifacts/loading-screen";
import { SiteBackdrop } from "@/components/artifacts/site-backdrop";

export default function Home() {
  return (
    <>
      <SiteBackdrop />
      <LoadingScreen />
      <Navbar />
      <div className="relative z-10 md:mr-[42%]">
        <main>
          <Hero />
          <About />
          <PrinciplesMarquee />
          <Gallery />
          <PrinciplesMarquee />
          <Styles />
          <PrinciplesMarquee />
          <Process />
          <Artist />
          <Testimonials />
          <ArtistStory />
          <QuoteForm />
          <InstagramSection />
          <Location />
          <CtaBand />
        </main>
        <Footer />
      </div>
      <WhatsAppFab />
    </>
  );
}
