import type { Metadata } from "next";
import { ComparisonTable } from "@/components/landing/comparison-table";
import { CtaSection } from "@/components/landing/cta-section";
import { FaqSection } from "@/components/landing/faq-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { PlansSection } from "@/components/landing/plans-section";
import { ProblemSection } from "@/components/landing/problem-section";
import { WhatYouGet } from "@/components/landing/what-you-get";
import { asset } from "@/lib/assets";
import { BRAND_NAME, BRAND_THEME_COLOR } from "@/lib/brand";

const LANDING_TITLE = "NA MESA | Comanda digital e pedido na mesa para restaurantes";
const LANDING_DESCRIPTION =
  "NA MESA — pedido na mesa sem fila no balcão. Comanda digital pra rodízio, bar, casa de carne e restaurante de salão. Planos a partir de R$997 no ano.";
const LANDING_OG_DESCRIPTION =
  "O cliente pede no celular, a cozinha recebe, a conta fecha sem briga. Feito pra quem vive do salão.";

export const metadata: Metadata = {
  title: LANDING_TITLE,
  description: LANDING_DESCRIPTION,
  openGraph: {
    title: LANDING_TITLE,
    description: LANDING_OG_DESCRIPTION,
    siteName: BRAND_NAME,
    type: "website",
    locale: "pt_BR",
    images: [{ url: asset("/landing/hero.jpg"), width: 960, height: 540, alt: "Pedido na mesa — NA MESA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: LANDING_TITLE,
    description: LANDING_OG_DESCRIPTION,
    images: [asset("/landing/hero.jpg")],
  },
  other: {
    "theme-color": BRAND_THEME_COLOR,
  },
};

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#111] font-[system-ui,-apple-system,'Segoe_UI',Roboto,Ubuntu,Cantarell,sans-serif] text-[#f2f2f2] antialiased [scroll-behavior:auto]">
      <LandingHeader />

      <main id="topo" className="mx-auto w-full max-w-[960px] px-4 pb-8">
        <HeroSection />
        <ProblemSection />
        <HowItWorks />
        <WhatYouGet />
        <ComparisonTable />
        <PlansSection />

        <section aria-label="Nota" className="py-2">
          <p className="rounded-r-lg border-l-[3px] border-brand bg-[#1a1a1a] px-4 py-3.5 text-[0.92rem] text-muted">
            Estamos subindo as primeiras casas — se quiser, a gente te mostra ao vivo.
          </p>
        </section>

        <FaqSection />
        <CtaSection />
        <LandingFooter />
      </main>
    </div>
  );
}
