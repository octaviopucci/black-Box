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
  title: "Octávio Pucci | Realismo, Fine Line e Coberturas",
  description:
    "Tatuador de realismo preto e cinza, fine line e coberturas naturais. Projetos autorais com atenção do primeiro ao último traço. @octaviopuccitattoo",
  openGraph: {
    title: "Octávio Pucci Tattoo",
    description:
      "Realismo preto e cinza, fine line e coberturas que parecem pele limpa — projetos exclusivos e autorais.",
    images: ["/instagram/post-5.jpg"],
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
