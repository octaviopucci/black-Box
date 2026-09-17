import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_TAGLINE, BRAND_TITLE } from "@/lib/brand";
import { asset } from "@/lib/assets";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: BRAND_TITLE,
  description: BRAND_DESCRIPTION,
  applicationName: BRAND_NAME,
  openGraph: {
    title: BRAND_TITLE,
    description: BRAND_DESCRIPTION,
    siteName: BRAND_NAME,
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary",
    title: BRAND_TITLE,
    description: BRAND_DESCRIPTION,
  },
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
  themeColor: "#18242C",
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
