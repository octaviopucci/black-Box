"use client";

import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductFilters, SortOption } from "@/types";

interface ProductFiltersProps {
  brands: string[];
  colors: string[];
  storageOptions: string[];
  priceRange: { min: number; max: number };
  filters: ProductFilters;
  sort: SortOption;
  onFiltersChange: (filters: ProductFilters) => void;
  onSortChange: (sort: SortOption) => void;
  resultCount: number;
  children: React.ReactNode;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Destaque" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "newest", label: "Novidades" },
  { value: "bestseller", label: "Mais vendidos" },
];

export function ProductFiltersPanel({
  brands,
  colors,
  storageOptions,
  priceRange,
  filters,
  sort,
  onFiltersChange,
  onSortChange,
  resultCount,
  children,
}: ProductFiltersProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleBrand = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFiltersChange({ ...filters, brands: next });
  };

  const toggleColor = (color: string) => {
    const next = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFiltersChange({ ...filters, colors: next });
  };

  const toggleStorage = (s: string) => {
    const next = filters.storage.includes(s)
      ? filters.storage.filter((st) => st !== s)
      : [...filters.storage, s];
    onFiltersChange({ ...filters, storage: next });
  };

  const filterContent = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-semibold">Marca</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="accent-brand-silver"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {colors.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold">Cor</h3>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => toggleColor(color)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                  filters.colors.includes(color)
                    ? "border-brand-silver bg-brand-silver/10"
                    : "border-brand-border hover:border-brand-black"
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {storageOptions.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold">Armazenamento</h3>
          <div className="flex flex-wrap gap-2">
            {storageOptions.map((s) => (
              <button
                key={s}
                onClick={() => toggleStorage(s)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
                  filters.storage.includes(s)
                    ? "border-brand-silver bg-brand-silver/10"
                    : "border-brand-border hover:border-brand-black"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="mb-3 text-sm font-semibold">Preço</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Mín"
            value={filters.minPrice ?? ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                minPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Máx"
            value={filters.maxPrice ?? ""}
            onChange={(e) =>
              onFiltersChange({
                ...filters,
                maxPrice: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="w-full rounded-lg border border-brand-border px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.inStock ?? false}
            onChange={(e) =>
              onFiltersChange({ ...filters, inStock: e.target.checked || undefined })
            }
            className="accent-brand-silver"
          />
          Apenas disponíveis
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={filters.onSale ?? false}
            onChange={(e) =>
              onFiltersChange({ ...filters, onSale: e.target.checked || undefined })
            }
            className="accent-brand-silver"
          />
          Em promoção
        </label>
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-brand-gray">
          {resultCount} {resultCount === 1 ? "produto" : "produtos"}
        </p>
        <div className="flex items-center gap-3">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="rounded-lg border border-brand-border bg-white px-3 py-2 text-sm"
            aria-label="Ordenar produtos"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => setDrawerOpen(true)}
            className="btn-outline flex items-center gap-2 py-2 text-sm lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        <aside className="hidden w-56 shrink-0 lg:block">{filterContent}</aside>
        <div className="min-w-0 flex-1">{children}</div>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Filtros</h2>
                <button
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Fechar filtros"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              {filterContent}
              <button
                onClick={() => setDrawerOpen(false)}
                className="btn-primary mt-6 w-full"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
