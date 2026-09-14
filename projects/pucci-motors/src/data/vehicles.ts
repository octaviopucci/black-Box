import type { PublicCatalogVehicle } from "@/lib/catalog-api";

export type Vehicle = {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: number | null;
  price: number | null;
  transmission: string | null;
  fuel: string | null;
  highlights: string[];
  description: string;
  image: string;
};

export function catalogVehicleToSite(v: PublicCatalogVehicle): Vehicle {
  return {
    id: v.id,
    title: v.title,
    brand: v.brand,
    model: v.model,
    year: v.year || null,
    price: v.price || null,
    transmission: v.transmission || null,
    fuel: v.fuel || null,
    highlights: v.highlights,
    description: v.description,
    image: v.image,
  };
}

export function formatPrice(value: number | null | undefined) {
  if (value == null || value <= 0) return "Consulte";
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function getVehicle(id: string, vehicles: Vehicle[]): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}

export function availableBrands(vehicles: Vehicle[]): string[] {
  return [...new Set(vehicles.map((v) => v.brand).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
}

/** Entregas recentes — futuro: sincronizar vendidos do LP Motors. */
export const soldVehicles: Array<
  Vehicle & { praise?: string | null; instagram?: string }
> = [];
