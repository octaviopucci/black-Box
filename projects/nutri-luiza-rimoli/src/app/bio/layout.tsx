import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links — Luiza Rimoli",
  description:
    "Agende consulta, acesse o site e siga no Instagram. Nutrição clínica, esportiva e comportamental.",
  openGraph: {
    title: "Luiza Rimoli — Links",
    description: "Instagram, site e Clínica Levittá em um só lugar.",
    type: "website",
  },
};

export default function BioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
