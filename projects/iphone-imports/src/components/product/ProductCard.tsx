"use client";

import Link from "next/link";
import { ProductImage } from "@/components/product/ProductImage";
import { getPrimaryImage } from "@/lib/product-image";
import { Heart, ShoppingCart, Plus } from "lucide-react";
import { Price } from "@/components/ui/Price";
import { useCartStore } from "@/store/cart";
import { useFavoritesStore } from "@/store/favorites";
import { useToast } from "@/store/toast";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  dark?: boolean;
}

export function ProductCard({ product, priority, dark }: ProductCardProps) {
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
      image: getPrimaryImage(product),
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

  const cardClass = dark ? "card-product-dark" : "card-product";

  return (
    <article className={`${cardClass} group`}>
      <Link href={`/produto/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden product-image-bg">
          <ProductImage
            product={product}
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
            priority={priority}
          />
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {product.sale && <span className="badge-sale">Oferta</span>}
            {product.new && <span className="badge-new">Novo</span>}
            {product.bestSeller && (
              <span className="badge-bestseller">Top</span>
            )}
          </div>
          <button
            onClick={handleFavorite}
            className={cn(
              "absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-all hover:bg-brand-silver hover:text-brand-black",
              isFavorite && "bg-brand-silver text-brand-black"
            )}
            aria-label={isFavorite ? "Remover dos favoritos" : "Favoritar"}
          >
            <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
          </button>

          <button
            onClick={handleAddToCart}
            disabled={!product.stock}
            className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-brand-silver text-brand-black opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 disabled:hidden"
            aria-label="Adicionar ao carrinho"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className={cn("p-4", dark && "text-white")}>
          <p className={cn("mb-1 text-[10px] font-bold uppercase tracking-wider", dark ? "text-brand-gray" : "text-brand-muted")}>
            {product.brand}
          </p>
          <h3 className={cn("mb-2 line-clamp-2 text-sm font-bold leading-snug", dark ? "text-white" : "text-brand-black")}>
            {product.name}
          </h3>
          <Price
            price={product.price}
            oldPrice={product.oldPrice}
            installment={product.installment}
            size="sm"
            dark={dark}
          />
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={!product.stock}
          className="btn-primary w-full py-2.5 text-xs lg:hidden disabled:opacity-50"
        >
          <ShoppingCart className="h-4 w-4" />
          {product.stock ? "Adicionar" : "Indisponível"}
        </button>
      </div>
    </article>
  );
}
