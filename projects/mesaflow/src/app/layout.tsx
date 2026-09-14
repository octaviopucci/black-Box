import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { asset } from "@/lib/assets";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "MesaFlow — Seu pedido, sem espera",
  description: "Garçom digital + pedidos por QR Code para restaurantes, bares e padarias.",
  applicationName: "MesaFlow",
  icons: {
    icon: [
      { url: asset("/brand/icon-16.png"), sizes: "16x16", type: "image/png" },
      { url: asset("/brand/icon-32.png"), sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: asset("/brand/icon-180.png"), sizes: "180x180", type: "image/png" }],
  },
  manifest: asset("/manifest.webmanifest"),
};

export const viewport: Viewport = {
  themeColor: "#1A1A1A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={montserrat.variable}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
