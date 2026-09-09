import { products } from "@/data/products";
import type { Product, ProductFilters, SortOption } from "@/types";

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getSaleProducts(): Product[] {
  return products.filter((p) => p.sale);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.bestSeller);
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.new);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, limit);
}

export function searchProducts(query: string): Product[] {
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

export function getAllBrands(): string[] {
  return [...new Set(products.map((p) => p.brand))].sort();
}

export function filterAndSortProducts(
  items: Product[],
  filters: Partial<ProductFilters>,
  sort: SortOption
): Product[] {
  let result = [...items];

  if (filters.brands?.length) {
    result = result.filter((p) => filters.brands!.includes(p.brand));
  }
  if (filters.minPrice !== undefined) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.inStock) {
    result = result.filter((p) => p.stock);
  }
  if (filters.onSale) {
    result = result.filter((p) => p.sale);
  }
  if (filters.colors?.length) {
    result = result.filter((p) =>
      p.colors?.some((c) => filters.colors!.includes(c))
    );
  }
  if (filters.storage?.length) {
    result = result.filter((p) =>
      p.storage?.some((s) => filters.storage!.includes(s))
    );
  }

  switch (sort) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "newest":
      result.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
      break;
    case "bestseller":
      result.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
      break;
    default:
      result.sort(
        (a, b) =>
          (b.featured ? 2 : 0) +
          (b.sale ? 1 : 0) -
          ((a.featured ? 2 : 0) + (a.sale ? 1 : 0))
      );
  }

  return result;
}

export function getPriceRange(items: Product[]): { min: number; max: number } {
  if (!items.length) return { min: 0, max: 0 };
  const prices = items.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export { products };
