import type { Metadata } from "next";
import { getSaleProducts } from "@/lib/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { storeConfig } from "@/config/store";

export const metadata: Metadata = {
  title: "Ofertas",
  description: `Promoções e ofertas exclusivas da ${storeConfig.name}.`,
};

export default function OffersPage() {
  const saleProducts = getSaleProducts();

  return (
    <div className="container-store py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Ofertas" },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ofertas</h1>
        <p className="mt-2 text-brand-gray">
          Promoções e condições exclusivas. {saleProducts.length} produtos em
          oferta.
        </p>
      </div>

      <ProductGrid products={saleProducts} priorityCount={4} />
    </div>
  );
}
