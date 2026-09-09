import type { Metadata } from "next";
import { storeConfig } from "@/config/store";

export const metadata: Metadata = {
  title: "Ofertas",
  description: `Promoções e ofertas exclusivas da ${storeConfig.name}.`,
};

export default function OffersLayout({ children }: { children: React.ReactNode }) {
  return children;
}
