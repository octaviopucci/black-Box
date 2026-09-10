import type { Metadata } from "next";
import { Lora, Playfair_Display } from "next/font/google";
import { Providers } from "../providers";
import "../globals.css";
import "../../styles/victorian.css";

const sans = Lora({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Stella de Sá | Atelier Fineline — Edição Victoriana",
  description:
    "Tatuagens fineline em Alphaville. Uma experiência de arte na pele com elegância de salão victoriano.",
  openGraph: {
    title: "Stella de Sá — Edição Victoriana",
    description: "Fineline e tatuagens delicadas com estética clássica.",
    images: ["/hero/stella-artist.jpg"],
  },
};

export default function VictorianLayout({ children }: LayoutProps<"/v2">) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${display.variable} theme-victorian`}>
      <body className="theme-victorian min-h-screen bg-paper font-sans text-ink antialiased">
        <Providers themeVariant="victorian">{children}</Providers>
      </body>
    </html>
  );
}
