import { LoadingScreen } from "@/components/loading-screen";
import { About } from "@/components/sections/about";
import { BuyForm } from "@/components/sections/buy-form";
import { Contact } from "@/components/sections/contact";
import { Deliveries } from "@/components/sections/deliveries";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { HowToBuy } from "@/components/sections/how-to-buy";
import { Navbar } from "@/components/sections/navbar";
import { Stock } from "@/components/sections/stock";
import { WhatsAppFab } from "@/components/sections/whatsapp-fab";
import { Marquee } from "@/components/ui/marquee";
import { VehicleSelectionProvider } from "@/components/vehicle-selection";
import { site } from "@/data/site";

export default function Home() {
  return (
    <VehicleSelectionProvider>
      <LoadingScreen />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Marquee items={site.principles} />
        <HowToBuy />
        <Marquee items={site.principles} />
        <Stock />
        <Marquee items={site.principles} />
        <Deliveries />
        <BuyForm />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFab />
    </VehicleSelectionProvider>
  );
}
