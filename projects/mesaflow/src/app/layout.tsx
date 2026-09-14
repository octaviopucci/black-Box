import type { Metadata } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import "./globals.css";

const sans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });
const display = Outfit({ subsets: ["latin"], variable: "--font-display" });

export const metadata: Metadata = {
  title: "MesaFlow — Garçom digital",
  description: "Sistema de pedidos por QR Code para restaurantes, bares e padarias.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sans.variable} ${display.variable}`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
