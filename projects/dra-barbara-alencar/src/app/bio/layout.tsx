import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links — Dra. Barbara Alencar",
  description:
    "Agende avaliação, acesse o site e siga no Instagram. Estética facial com naturalidade.",
  openGraph: {
    title: "Dra. Barbara Alencar — Links",
    description: "Instagram e site em um só lugar.",
    type: "website",
  },
};

export default function BioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
