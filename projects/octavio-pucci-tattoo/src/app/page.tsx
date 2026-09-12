import { ClosingCta } from "@/components/sections/closing-cta";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Location } from "@/components/sections/location";
import { Navbar } from "@/components/sections/navbar";
import { ProofStats } from "@/components/sections/proof-stats";
import { Services } from "@/components/sections/services";
import { Testimonials } from "@/components/sections/testimonials";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProofStats />
        <Services />
        <HowItWorks />
        <Testimonials />
        <Location />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
