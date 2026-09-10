"use client";

import { useState, useMemo } from "react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductGrid } from "./ProductGrid";
import { ProductFiltersPanel } from "./ProductFilters";
import { EmptyState } from "@/components/ui/EmptyState";
import { Package } from "lucide-react";
import { filterAndSortProducts, getPriceRange } from "@/lib/products";
import { useCatalog } from "@/components/catalog/CatalogProvider";
import { products as staticProducts } from "@/data/products";
import type { Category } from "@/types";
import type { ProductFilters, SortOption } from "@/types";

interface CategoryPageProps {
  category: Category;
}

export function CategoryPageClient({ category }: CategoryPageProps) {
  const { products: catalogProducts, live } = useCatalog();
  const source = live ? catalogProducts : staticProducts;
  const initialProducts = source.filter((p) => p.categorySlug === category.slug);
  const [filters, setFilters] = useState<ProductFilters>({
    brands: [],
    colors: [],
    storage: [],
  });
  const [sort, setSort] = useState<SortOption>("featured");

  const brands = useMemo(
    () => [...new Set(initialProducts.map((p) => p.brand))].sort(),
    [initialProducts]
  );
  const colors = useMemo(
    () => [...new Set(initialProducts.flatMap((p) => p.colors ?? []))],
    [initialProducts]
  );
  const storageOptions = useMemo(
    () => [...new Set(initialProducts.flatMap((p) => p.storage ?? []))],
    [initialProducts]
  );
  const priceRange = useMemo(() => getPriceRange(initialProducts), [initialProducts]);

  const filtered = useMemo(
    () => filterAndSortProducts(initialProducts, filters, sort),
    [initialProducts, filters, sort]
  );

  return (
    <div className="container-store py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: category.name },
        ]}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        <p className="mt-2 text-brand-gray">{category.description}</p>
      </div>

      <ProductFiltersPanel
        brands={brands}
        colors={colors}
        storageOptions={storageOptions}
        priceRange={priceRange}
        filters={filters}
        sort={sort}
        onFiltersChange={setFilters}
        onSortChange={setSort}
        resultCount={filtered.length}
      >
        {filtered.length > 0 ? (
          <ProductGrid products={filtered} priorityCount={4} />
        ) : (
          <EmptyState
            icon={<Package className="h-12 w-12" />}
            title="Nenhum produto encontrado"
            description="Tente ajustar os filtros para ver mais resultados."
            actionLabel="Ver todos os produtos"
            actionHref="/"
          />
        )}
      </ProductFiltersPanel>
    </div>
  );
}
