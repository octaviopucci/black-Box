import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StudioClownTattoo | Arte que fica marcada para sempre",
  description:
    "Tatuagens exclusivas com técnica, personalidade e dedicação em cada detalhe. Solicite seu orçamento pelo WhatsApp.",
  openGraph: {
    title: "StudioClownTattoo",
    description:
      "Tatuagens exclusivas com técnica, personalidade e dedicação em cada detalhe.",
    images: [
      "https://media.base44.com/images/public/user_6a2c5e47c9d1637a9cb37cfd/294ee25b1_79f8688f-9ae3-4d3a-9467-60bcf41f81c8.jpg",
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${display.variable} ${sans.variable}`}
    >
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
