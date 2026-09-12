import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Octávio Pucci — Tatuagem",
  description:
    "Fine Line, Realismo, Reforma e Cobertura. Projetos autorais — @octaviopuccitattoo.",
  openGraph: {
    title: "Octávio Pucci Tattoo",
    description: "Trabalhos reais do Instagram @octaviopuccitattoo",
    images: ["/instagram/profile.jpg"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${fraunces.variable} ${plexMono.variable} h-full`}>
      <body className="min-h-full font-[family-name:var(--font-mono)] text-[var(--ink)] antialiased">
        {children}
      </body>
    </html>
  );
}
