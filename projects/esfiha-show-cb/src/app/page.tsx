import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Flavors } from "@/components/sections/flavors";
import { Gallery } from "@/components/sections/gallery";
import { Location } from "@/components/sections/location";
import { OrderCta } from "@/components/sections/order-cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Flavors />
        <Gallery />
        <Location />
        <OrderCta />
      </main>
      <Footer />
    </>
  );
}
