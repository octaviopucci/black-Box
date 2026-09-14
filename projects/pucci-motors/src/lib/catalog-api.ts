export interface PublicCatalogVehicle {
  id: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  version: string;
  year: number;
  price: number;
  transmission: string;
  fuel: string;
  mileage: number;
  color: string;
  city: string;
  state: string;
  images: string[];
  image: string;
  highlights: string[];
  description: string;
  internalCode: string;
}

export interface LiveCatalog {
  storeName: string;
  storeSlug: string;
  whatsapp: string;
  phone: string;
  instagram: string;
  address: string;
  city: string;
  vehicles: PublicCatalogVehicle[];
  generatedAt: string;
}

const API_BASE =
  process.env.NEXT_PUBLIC_CATALOG_API ||
  (typeof window !== "undefined"
    ? `${window.location.origin}/api/lp-motors`
    : "/api/lp-motors");

export const STORE_SLUG = process.env.NEXT_PUBLIC_LP_ORG_SLUG || "pucci-motors";

export async function fetchLiveCatalog(storeSlug = STORE_SLUG): Promise<LiveCatalog | null> {
  try {
    const res = await fetch(`${API_BASE}/catalog/${storeSlug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = (await res.json()) as LiveCatalog;
    if (!data?.storeSlug) return null;
    return {
      ...data,
      vehicles: data.vehicles ?? [],
    };
  } catch {
    return null;
  }
}
