import dynamic from "next/dynamic";
import { Hero } from "@/components/sections/hero";
import { Navbar } from "@/components/sections/navbar";

const About = dynamic(() =>
  import("@/components/sections/about").then((m) => ({ default: m.About })),
);
const Gallery = dynamic(() =>
  import("@/components/sections/gallery").then((m) => ({ default: m.Gallery })),
);
const Styles = dynamic(() =>
  import("@/components/sections/styles").then((m) => ({ default: m.Styles })),
);
const Process = dynamic(() =>
  import("@/components/sections/process").then((m) => ({ default: m.Process })),
);
const Artist = dynamic(() =>
  import("@/components/sections/artist").then((m) => ({ default: m.Artist })),
);
const Testimonials = dynamic(() =>
  import("@/components/sections/testimonials").then((m) => ({
    default: m.Testimonials,
  })),
);
const QuoteForm = dynamic(() =>
  import("@/components/sections/quote-form").then((m) => ({ default: m.QuoteForm })),
);
const InstagramSection = dynamic(() =>
  import("@/components/sections/instagram").then((m) => ({
    default: m.InstagramSection,
  })),
);
const Location = dynamic(() =>
  import("@/components/sections/location").then((m) => ({ default: m.Location })),
);
const CtaBand = dynamic(() =>
  import("@/components/sections/cta-band").then((m) => ({ default: m.CtaBand })),
);
const Footer = dynamic(() =>
  import("@/components/sections/footer").then((m) => ({ default: m.Footer })),
);
const WhatsAppFab = dynamic(() =>
  import("@/components/sections/whatsapp-fab").then((m) => ({ default: m.WhatsAppFab })),
);

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="section-lazy">
          <About />
        </div>
        <div className="section-lazy">
          <Gallery />
        </div>
        <div className="section-lazy">
          <Styles />
        </div>
        <div className="section-lazy">
          <Process />
        </div>
        <div className="section-lazy">
          <Artist />
        </div>
        <div className="section-lazy">
          <Testimonials />
        </div>
        <div className="section-lazy">
          <QuoteForm />
        </div>
        <div className="section-lazy">
          <InstagramSection />
        </div>
        <div className="section-lazy">
          <Location />
        </div>
        <div className="section-lazy">
          <CtaBand />
        </div>
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
