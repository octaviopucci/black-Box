import type { Metadata } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { asset } from "@/lib/assets";
import { site } from "@/data/site";
import "./globals.css";

const sans = Space_Grotesk({
  variable: "--font-sans",
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

const description =
  "Novos e seminovos em Capão Bonito/SP com preço no anúncio, foto do carro real, financiamento em até 60x, trocas e consignação. Escolha o carro e fale com a loja no WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL("https://blckbox.vercel.app"),
  title: `${site.name} | Novos e seminovos em Capão Bonito/SP`,
  description,
  icons: { icon: asset("/favicon.svg") },
  openGraph: {
    title: site.name,
    description,
    locale: "pt_BR",
    type: "website",
    images: [asset(site.assets.ogImage)],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
