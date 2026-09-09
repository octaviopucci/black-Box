"use client";

import { useCatalog } from "@/components/catalog/CatalogProvider";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tag } from "lucide-react";

export default function OffersPage() {
  const { products, loading } = useCatalog();
  const saleProducts = products.filter((p) => p.sale);

  return (
    <div className="container-store py-8 md:py-12">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Ofertas" }]} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Ofertas</h1>
        <p className="mt-2 text-brand-gray">
          Promoções com estoque em tempo real. {saleProducts.length} produto
          {saleProducts.length !== 1 ? "s" : ""} em oferta.
        </p>
      </div>

      {loading ? (
        <p className="text-brand-muted">Carregando...</p>
      ) : saleProducts.length > 0 ? (
        <ProductGrid products={saleProducts} priorityCount={4} />
      ) : (
        <EmptyState
          icon={<Tag className="h-12 w-12" />}
          title="Nenhuma oferta no momento"
          description="Volte em breve ou fale conosco pelo WhatsApp."
          actionLabel="Voltar à loja"
          actionHref="/"
        />
      )}
    </div>
  );
}
