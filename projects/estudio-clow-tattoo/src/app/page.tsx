import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { Gallery } from "@/components/sections/gallery";
import { Hero } from "@/components/sections/hero";
import { Navbar } from "@/components/sections/navbar";
import { Roadmap } from "@/components/sections/roadmap";
import { Styles } from "@/components/sections/styles";
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
        <Marquee items={site.principles} />
        <Gallery />
        <Marquee items={site.principles} />
        <Roadmap />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
