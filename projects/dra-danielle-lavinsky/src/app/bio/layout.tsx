import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Links — Dra. Danielle Lavinsky",
  description:
    "Agende consulta, acesse o site e siga no Instagram. DTM, bruxismo e dor orofacial em Porto Alegre.",
  openGraph: {
    title: "Dra. Danielle Lavinsky — Links",
    description: "WhatsApp, site e Instagram em um só lugar.",
    type: "website",
  },
};

export default function BioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
