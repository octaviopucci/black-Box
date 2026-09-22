import type { Metadata } from "next";
import { AudienceSection } from "@/components/landing/audience-section";
import { BeforeAfterSection } from "@/components/landing/before-after-section";
import { ComparisonTable } from "@/components/landing/comparison-table";
import { CtaSection } from "@/components/landing/cta-section";
import { FaqSection } from "@/components/landing/faq-section";
import { OrganizeMesaSection, WaiterSection } from "@/components/landing/features-section";
import { HeroSection } from "@/components/landing/hero-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { MoneySection } from "@/components/landing/money-section";
import { CostSection, NightSection, QrFlowSection, QrProblemSection } from "@/components/landing/pain-sections";
import { PackageSection } from "@/components/landing/package-section";
import { PlansSection } from "@/components/landing/plans-section";
import { ProofSection } from "@/components/landing/proof-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { asset } from "@/lib/assets";
import { BRAND_NAME, BRAND_THEME_COLOR } from "@/lib/brand";

const LANDING_TITLE = "Pedido na mesa com QR | Comanda na cozinha | NA MESA";
const LANDING_DESCRIPTION =
  "O cliente escaneia o QR, escolhe e envia o pedido pelo celular. A comanda entra na operação da casa. Conheça o NA MESA.";

export const metadata: Metadata = {
  title: LANDING_TITLE,
  description: LANDING_DESCRIPTION,
  keywords: [
    "pedido na mesa QR",
    "cardápio digital com pedido",
    "comanda digital restaurante",
    "QR code para pedir na mesa",
    "sistema de salão para restaurante",
    "cardápio QR que envia pedido",
  ],
  openGraph: {
    title: LANDING_TITLE,
    description: LANDING_DESCRIPTION,
    siteName: BRAND_NAME,
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: asset("/landing/kit/kit-placa-peca-pelo-celular.webp"),
        width: 800,
        height: 1000,
        alt: "NA MESA — Peça pelo celular",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: LANDING_TITLE,
    description: LANDING_DESCRIPTION,
    images: [asset("/landing/kit/kit-placa-peca-pelo-celular.webp")],
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
        <NightSection />
        <CostSection />
        <QrProblemSection />
        <QrFlowSection />
        <HowItWorks />
        <OrganizeMesaSection />
        <WaiterSection />
        <BeforeAfterSection />
        <MoneySection />
        <ComparisonTable />
        <PackageSection />
        <ProofSection />
        <TestimonialsSection />
        <AudienceSection />
        <PlansSection />
        <FaqSection />
        <CtaSection />
        <LandingFooter />
      </main>
    </div>
  );
}
