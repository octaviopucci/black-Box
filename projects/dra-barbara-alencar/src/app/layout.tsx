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
  title: "Dra. Barbara Alencar — Estética Facial com Naturalidade",
  description:
    "Estética que respeita quem você é. Reestruturação facial, harmonização e planejamento estratégico.",
  openGraph: {
    title: "Dra. Barbara Alencar",
    description:
      "Naturalidade, sustentação e proporção — sem apagar o que faz você ser você.",
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
