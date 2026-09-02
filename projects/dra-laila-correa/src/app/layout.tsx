import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Dra. Laila Correa — Botox com Naturalidade",
  description:
    "Cuidar, prevenir e suavizar sem perder quem você é. Botox com naturalidade e planejamento.",
  openGraph: {
    title: "Dra. Laila Correa",
    description:
      "Rosto descansado e bem cuidado — sem deixar o rosto sem expressão.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-[100dvh] overflow-x-hidden">{children}</body>
    </html>
  );
}
