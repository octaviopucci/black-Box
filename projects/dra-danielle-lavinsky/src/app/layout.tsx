import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dra. Danielle Lavinsky — DTM e Dor Orofacial em Porto Alegre",
  description:
    "Especialista em DTM, bruxismo e dor orofacial. Clínica Lavinsky, Moinhos de Vento. Agende pelo WhatsApp.",
  openGraph: {
    title: "Dra. Danielle Lavinsky",
    description:
      "DTM, bruxismo e odontologia do sono — atendimento com escuta e critério clínico.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-[100dvh] overflow-x-hidden">{children}</body>
    </html>
  );
}
