import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Nunito_Sans } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const sans = Nunito_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stella de Sá | Tatuadora Fineline em Alphaville",
  description:
    "Tatuagens delicadas e fineline em Alphaville, Barueri. Stella de Sá — traços finos, elegância e arte personalizada para mulheres.",
  openGraph: {
    title: "Stella de Sá | Tatuadora Fineline",
    description:
      "Studio de tatuagens delicadas em Alphaville. Fineline, glitter, gold e projetos personalizados.",
    images: ["/hero/stella-hero.jpeg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${display.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
