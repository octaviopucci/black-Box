import type { Metadata } from "next";
import { Bebas_Neue, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Octávio Pucci Tattoo — Realismo, Cobertura & Fine Line",
  description:
    "Tatuador especialista em realismo preto e cinza, coberturas, reformas e fine line. Projetos autorais com dedicação do primeiro ao último traço. São Paulo.",
  openGraph: {
    title: "Octávio Pucci Tattoo",
    description:
      "Realismo, cobertura e projetos autorais — @octaviopuccitattoo",
    images: ["/instagram/post-5.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${bebas.variable} ${sourceSans.variable} h-full`}>
      <body className="min-h-full bg-[var(--paper)] font-[family-name:var(--font-body)] text-[var(--ink)] antialiased">
        {children}
      </body>
    </html>
  );
}
