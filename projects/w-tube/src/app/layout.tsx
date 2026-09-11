import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { storeConfig } from "@/config/store";
import { TopBar } from "@/components/layout/TopBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ToastContainer } from "@/store/toast";
import { CatalogProvider } from "@/components/catalog/CatalogProvider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(storeConfig.siteUrl),
  title: {
    default: `${storeConfig.name}`,
    template: `%s | ${storeConfig.name}`,
  },
  description: storeConfig.description,
  openGraph: {
    title: storeConfig.name,
    description: storeConfig.description,
    locale: "pt_BR",
    type: "website",
    siteName: storeConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: storeConfig.name,
    description: storeConfig.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${bebasNeue.variable}`}>
      <body className="min-h-screen font-sans">
        <CatalogProvider>
          <TopBar />
          <Header />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <WhatsAppButton />
          <ToastContainer />
        </CatalogProvider>
      </body>
    </html>
  );
}
