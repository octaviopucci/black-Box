import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { MenuCorridor } from "@/components/sections/menu-corridor";
import { MenuFull } from "@/components/sections/menu-full";
import { Combos } from "@/components/sections/combos";
import { HowToOrder } from "@/components/sections/how-to-order";
import { Gallery } from "@/components/sections/gallery";
import { Location } from "@/components/sections/location";
import { Faq } from "@/components/sections/faq";
import { Footer } from "@/components/sections/footer";
import { StickyOrder } from "@/components/sections/sticky-order";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Manifesto />
        <MenuCorridor />
        <MenuFull />
        <Combos />
        <HowToOrder />
        <Gallery />
        <Location />
        <Faq />
      </main>
      <Footer />
      <StickyOrder />
    </>
  );
}
