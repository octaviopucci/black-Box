import type { Product } from "@/types";

/** Busca em qualquer lista de produtos (catálogo vivo ou estático). */
export function searchInProducts(products: Product[], query: string): Product[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return products.filter((p) => {
    const haystack = [
      p.name,
      p.brand,
      p.category,
      p.shortDescription,
      ...(p.keywords ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q) || q.split(" ").every((word) => haystack.includes(word));
  });
}
