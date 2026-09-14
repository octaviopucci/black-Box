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
  "Pucci Motors — seminovos selecionados com preço no anúncio, foto do carro real e estoque sincronizado com o gestor LP Motors. Financiamento, trocas e consignação.";

export const metadata: Metadata = {
  metadataBase: new URL("https://blckbox.vercel.app"),
  title: `${site.name} | Seminovos selecionados`,
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
