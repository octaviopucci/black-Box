import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Specialties } from "@/components/sections/specialties";
import { Portfolio } from "@/components/sections/portfolio";
import { Process } from "@/components/sections/process";
import { Cta } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Specialties />
        <Portfolio />
        <Process />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
