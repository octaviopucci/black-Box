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
    ? `${window.location.origin}/api/w-tube`
    : "/api/w-tube");

export const STORE_SLUG = process.env.NEXT_PUBLIC_STORE_SLUG || "w-tube";

const FALLBACK_SLUGS = ["w-tube"];

async function fetchCatalogForSlug(storeSlug: string): Promise<LiveCatalog | null> {
  const res = await fetch(`${API_BASE}/catalog/${storeSlug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as LiveCatalog;
}

async function discoverStoreSlug(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
    if (!res.ok) return null;
    const health = (await res.json()) as { slug?: string };
    return health.slug || null;
  } catch {
    return null;
  }
}

export async function fetchLiveCatalog(storeSlug = STORE_SLUG): Promise<LiveCatalog | null> {
  const discovered = await discoverStoreSlug();
  const slugs = [...new Set([discovered, storeSlug, ...FALLBACK_SLUGS].filter(Boolean))] as string[];
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
