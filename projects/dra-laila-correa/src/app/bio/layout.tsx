import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links — Dra. Laila Correa",
  description:
    "Agende avaliação, acesse o site e siga no Instagram. Botox com naturalidade.",
  openGraph: {
    title: "Dra. Laila Correa — Links",
    description: "Instagram e site em um só lugar.",
    type: "website",
  },
};

export default function BioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
