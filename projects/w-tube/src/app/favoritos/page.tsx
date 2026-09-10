"use client";

import { Heart } from "lucide-react";
import { useFavoritesStore } from "@/store/favorites";
import { products } from "@/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export default function FavoritesPage() {
  const ids = useFavoritesStore((s) => s.ids);
  const favoriteProducts = products.filter((p) => ids.includes(p.id));

  return (
    <div className="container-store py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Favoritos" },
        ]}
      />

      <h1 className="mb-8 text-3xl font-bold">Favoritos</h1>

      {favoriteProducts.length > 0 ? (
        <ProductGrid products={favoriteProducts} />
      ) : (
        <EmptyState
          icon={<Heart className="h-12 w-12" />}
          title="Nenhum favorito ainda"
          description="Salve seus produtos preferidos para encontrá-los facilmente."
          actionLabel="Explorar produtos"
          actionHref="/"
        />
      )}
    </div>
  );
}
