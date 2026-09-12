import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans } from "next/font/google";

import { WhatsAppFloat } from "@/components/sections/whatsapp-float";

import "./globals.css";

const bebasNeue = Bebas_Neue({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Octávio Pucci Tattoo Infinity — Tatuagem em Capão Bonito",
  description:
    "Tatuagem autoral em Capão Bonito, SP. Orçamento fechado antes da sessão. Chame no WhatsApp.",
  openGraph: {
    title: "Octávio Pucci Tattoo Infinity",
    description:
      "Sua ideia vira tatuagem que você vai querer mostrar — sem pressa, sem surpresa no preço.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${bebasNeue.variable} ${dmSans.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
