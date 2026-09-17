import type { Metadata } from "next"
import { Cormorant_Garamond, DM_Sans } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "Odonto Studio — Clínica Odontológica em São Paulo",
  description:
    "Odontologia de precisão com acolhimento real. Implantes, ortodontia, estética e clareamento. Agende sua avaliação pelo WhatsApp.",
  openGraph: {
    title: "Odonto Studio — Clínica Odontológica",
    description:
      "Seu sorriso merece técnica, tempo e cuidado de verdade. Agende pelo WhatsApp.",
    locale: "pt_BR",
    type: "website",
  },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${dmSans.variable} ${cormorant.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[hsl(var(--paper))] font-sans text-[hsl(var(--ink))] antialiased">
        {children}
      </body>
    </html>
  )
}
