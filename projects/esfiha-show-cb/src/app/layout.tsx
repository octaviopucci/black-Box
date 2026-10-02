import type { Metadata } from "next";
import { PT_Sans, PT_Sans_Narrow } from "next/font/google";
import { site } from "@/data/site";
import { menuStats } from "@/data/menu";
import "./globals.css";

const display = PT_Sans_Narrow({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const body = PT_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: `${site.name} ${site.unit} — Cardápio, delivery e esfihas abertas`,
  description: site.description,
  openGraph: {
    title: `${site.name} ${site.unit}`,
    description: `${menuStats.items} itens no cardápio · ${site.hours.display}`,
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/logo.jpg", width: 224, height: 225, alt: site.name }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: `${site.name} ${site.unit}`,
  description: site.description,
  image: "/logo.jpg",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.state,
    postalCode: site.address.cep,
    addressCountry: "BR",
  },
  telephone: site.phone.landline,
  url: site.links.delivery,
  servesCuisine: ["Árabe", "Pizza", "Brasileira"],
  priceRange: "$$",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: site.proof.googleRating,
    bestRating: 5,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: site.hours.open,
      closes: site.hours.close,
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col pb-20 md:pb-0">{children}</body>
    </html>
  );
}
