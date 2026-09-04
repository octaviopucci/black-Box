"use client";

import { About } from "@/components/sections/about";
import { Artist } from "@/components/sections/artist";
import { ArtistStory } from "@/components/sections/artist-story";
import { CtaBand } from "@/components/sections/cta-band";
import { Footer } from "@/components/sections/footer";
import { Gallery } from "@/components/sections/gallery";
import { Hero } from "@/components/sections/hero";
import { InstagramCta } from "@/components/sections/instagram-cta";
import { InstagramSection } from "@/components/sections/instagram";
import { InstagramFab } from "@/components/sections/instagram-fab";
import { Navbar } from "@/components/sections/navbar";
import { Process } from "@/components/sections/process";
import { Styles } from "@/components/sections/styles";
import { Testimonials } from "@/components/sections/testimonials";
import { PrinciplesMarquee } from "@/components/home-marquees";
import { LoadingScreen } from "@/components/artifacts/loading-screen";

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <Navbar />
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
        <InstagramCta />
        <InstagramSection />
        <CtaBand />
      </main>
      <Footer />
      <InstagramFab />
    </>
  );
}
