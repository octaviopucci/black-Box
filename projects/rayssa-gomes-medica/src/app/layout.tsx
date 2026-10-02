import type { Metadata } from "next"
import { Cormorant_Garamond, DM_Sans } from "next/font/google"
import "./globals.css"

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Dra. Rayssa Alexandre — Medicina de Família · Itapeva/SP",
  description:
    "Clínica médica e medicina de família com olhar para corpo, mente e rotina. Atendimento na Clínica Harmonie, Itapeva/SP. Agende pelo WhatsApp.",
  openGraph: {
    title: "Dra. Rayssa Alexandre — Medicina de Família",
    description:
      "Cuidado que escuta, informa e acompanha. Clínica Harmonie, Itapeva/SP.",
    images: [{ url: "/instagram/profile.jpg", width: 640, height: 640 }],
  },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  )
}
