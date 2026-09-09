import { ProductCard } from "./ProductCard";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  priorityCount?: number;
  dark?: boolean;
}

export function ProductGrid({ products, priorityCount = 0, dark }: ProductGridProps) {
  if (!products.length) return null;

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={i < priorityCount}
          dark={dark}
        />
      ))}
    </div>
  );
}
