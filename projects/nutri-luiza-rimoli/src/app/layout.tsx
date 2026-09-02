import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Fraunces({
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
  title: "Luiza Rimoli — Nutricionista Clínica, Esportiva e Comportamental",
  description:
    "Reeducação alimentar com escuta e cuidado. Unicamp e USP. Atendimentos na Clínica Levittá.",
  openGraph: {
    title: "Luiza Rimoli — Nutricionista",
    description:
      "Nutrição clínica, esportiva e comportamental — plano personalizado, sem dietas extremas.",
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
