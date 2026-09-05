import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links — André Ventureli Tattoo",
  description:
    "Orçamento pelo WhatsApp, portfólio, Instagram e endereço do estúdio em Sorocaba.",
  openGraph: {
    title: "André Ventureli Tattoo — Links",
    description: "Realismo, coberturas e fineline — estúdio exclusivo em Sorocaba.",
    type: "website",
    images: ["/hero/andre-sobre.jpg"],
  },
};

export default function BioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
