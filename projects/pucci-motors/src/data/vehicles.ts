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

/** Imagens estáticas para o hero (visual NA Veículos). */
export const heroVehicleImages = [
  "/vehicles/DbLlGXYjlkC.jpg",
  "/vehicles/DbG3zhJmEU2.jpg",
  "/vehicles/DbDpk4FDnxq.jpg",
  "/vehicles/Da5GSBjjnIZ.jpg",
  "/vehicles/DaOakpggUik.jpg",
  "/vehicles/DaQ0nCRmB3U.jpg",
  "/vehicles/Da08VsHOaw2.jpg",
  "/vehicles/Da1BPs3BE_s.jpg",
  "/vehicles/Da5F5FXlv_D.jpg",
  "/vehicles/Da6HoEJh4yM.jpg",
  "/vehicles/Dadogk_P3_6.jpg",
  "/vehicles/DaiAtxjjomg.jpg",
  "/vehicles/DaLQEgKOq0X.jpg",
  "/vehicles/DangbypO5DK.jpg",
];

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
