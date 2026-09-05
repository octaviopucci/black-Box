import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "André Ventureli Tattoo | Realismo e Coberturas em Sorocaba",
  description:
    "Mais de 24 anos de experiência em realismo preto e cinza, coberturas, delicadas e old school. Estúdio exclusivo em Sorocaba/SP. Solicite seu orçamento.",
  openGraph: {
    title: "André Ventureli Tattoo",
    description:
      "Sua tattoo perfeita está aqui — realismo, coberturas, fineline e estilos clássicos em Sorocaba.",
    images: ["/hero/hero-bg.jpg"],
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
