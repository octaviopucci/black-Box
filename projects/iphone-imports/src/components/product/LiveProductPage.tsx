"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { ProductDetail } from "./ProductDetail";
import { fetchLiveProduct } from "@/lib/catalog-api";
import { getProductBySlug, getRelatedProducts } from "@/lib/products";
import { useCatalog } from "@/components/catalog/CatalogProvider";
import type { Product } from "@/types";

interface LiveProductPageProps {
  slug: string;
}

export function LiveProductPage({ slug }: LiveProductPageProps) {
  const { products: catalogProducts, live, loading: catalogLoading } = useCatalog();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      const fromCatalog = catalogProducts.find((p) => p.slug === slug);
      if (fromCatalog) {
        if (!cancelled) {
          setProduct(fromCatalog);
          setLoading(false);
        }
        return;
      }

      if (live) {
        const remote = await fetchLiveProduct(slug);
        if (remote && !cancelled) {
          setProduct(remote);
          setLoading(false);
          return;
        }
      }

      const fallback = getProductBySlug(slug);
      if (!cancelled) {
        setProduct(fallback ?? null);
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [slug, catalogProducts, live]);

  if (loading || catalogLoading) {
    return (
      <div className="container-store py-20 text-center text-brand-muted">
        Carregando produto...
      </div>
    );
  }

  if (!product) notFound();

  const related = getRelatedProducts(product, catalogProducts);

  return <ProductDetail product={product} related={related} />;
}
