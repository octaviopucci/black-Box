import type { Product, Category } from "@/types";

export interface LiveCatalog {
  storeName: string;
  storeSlug: string;
  whatsapp: string;
  hours?: string;
  topBarMessage?: string;
  promoBarMessage?: string;
  categories: Category[];
  products: Product[];
  generatedAt: string;
}

const API_BASE =
  process.env.NEXT_PUBLIC_CATALOG_API ||
  (typeof window !== "undefined"
    ? `${window.location.origin}/api/iphone-imports`
    : "/api/iphone-imports");

export const STORE_SLUG = process.env.NEXT_PUBLIC_STORE_SLUG || "iphone-imports";

const FALLBACK_SLUGS = ["iphone-imports", "iphone-imports-9c11"];

async function fetchCatalogForSlug(storeSlug: string): Promise<LiveCatalog | null> {
  const res = await fetch(`${API_BASE}/catalog/${storeSlug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as LiveCatalog;
}

export async function fetchLiveCatalog(storeSlug = STORE_SLUG): Promise<LiveCatalog | null> {
  const slugs = [storeSlug, ...FALLBACK_SLUGS.filter((s) => s !== storeSlug)];
  for (const slug of slugs) {
    try {
      const data = await fetchCatalogForSlug(slug);
      if (data?.products?.length) return data;
    } catch {
      /* tenta próximo slug */
    }
  }
  return null;
}

export async function fetchLiveProduct(
  productSlug: string,
  storeSlug = STORE_SLUG
): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/product/${productSlug}/${storeSlug}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as Product;
  } catch {
    return null;
  }
}
