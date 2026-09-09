"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { Search } from "lucide-react";
import { SearchBar } from "@/components/layout/SearchBar";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { searchProducts } from "@/lib/products";

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const results = useMemo(
    () => (query ? searchProducts(query) : []),
    [query]
  );

  return (
    <div className="container-store py-8 md:py-12">
      <h1 className="mb-6 text-3xl font-bold">Buscar</h1>
      <div className="mb-8 max-w-lg">
        <SearchBar />
      </div>

      {query && (
        <p className="mb-6 text-brand-gray">
          {results.length} resultado{results.length !== 1 ? "s" : ""} para
          &ldquo;{query}&rdquo;
        </p>
      )}

      {results.length > 0 ? (
        <ProductGrid products={results} />
      ) : query ? (
        <EmptyState
          icon={<Search className="h-12 w-12" />}
          title="Nenhum resultado encontrado"
          description={`Não encontramos produtos para "${query}". Tente outro termo.`}
          actionLabel="Ver todos os produtos"
          actionHref="/"
        />
      ) : (
        <p className="text-brand-gray">
          Digite um termo para buscar produtos, marcas ou categorias.
        </p>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
