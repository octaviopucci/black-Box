"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Price } from "@/components/ui/Price";
import { useCartStore } from "@/store/cart";
import { useFavoritesStore } from "@/store/favorites";
import { useToast } from "@/store/toast";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(product.id));
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      oldPrice: product.oldPrice,
      color: product.colors?.[0],
      storage: product.storage?.[0],
    });
    toast("Produto adicionado ao carrinho.");
    openCart();
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleFavorite(product.id);
    toast(added ? "Adicionado aos favoritos." : "Removido dos favoritos.");
  };

  return (
    <article className="card-product group">
      <Link href={`/produto/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-brand-light">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.03]"
            priority={priority}
          />
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {product.sale && <span className="badge-sale">Oferta</span>}
            {product.new && <span className="badge-new">Novo</span>}
            {product.bestSeller && (
              <span className="badge-bestseller">Mais vendido</span>
            )}
          </div>
          <button
            onClick={handleFavorite}
            className={cn(
              "absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm transition-colors hover:bg-white",
              isFavorite && "text-red-500"
            )}
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart
              className="h-4 w-4"
              fill={isFavorite ? "currentColor" : "none"}
            />
          </button>
        </div>
        <div className="p-4">
          <p className="mb-1 text-xs text-brand-gray">{product.brand}</p>
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-brand-black">
            {product.name}
          </h3>
          <Price
            price={product.price}
            oldPrice={product.oldPrice}
            installment={product.installment}
            size="sm"
          />
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={!product.stock}
          className="btn-primary w-full py-2.5 text-xs disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          {product.stock ? "Adicionar ao carrinho" : "Indisponível"}
        </button>
      </div>
    </article>
  );
}
