"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircle, ShoppingCart, Heart } from "lucide-react";
import { ProductGallery } from "./ProductGallery";
import { LiveStockBadge } from "./LiveStockBadge";
import { Price } from "@/components/ui/Price";
import { Rating } from "@/components/ui/Rating";
import { Button } from "@/components/ui/Button";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ProductGrid } from "./ProductGrid";
import { useCartStore } from "@/store/cart";
import { useFavoritesStore } from "@/store/favorites";
import { useToast } from "@/store/toast";
import { buildProductWhatsAppMessage, getWhatsAppUrl } from "@/lib/whatsapp";
import { storeConfig } from "@/config/store";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductDetailProps {
  product: Product;
  related: Product[];
}

export function ProductDetail({ product, related }: ProductDetailProps) {
  const [color, setColor] = useState(product.colors?.[0]);
  const [storage, setStorage] = useState(product.storage?.[0]);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const isFavorite = useFavoritesStore((s) => s.isFavorite(product.id));
  const { toast } = useToast();

  const productUrl = `${storeConfig.siteUrl}/produto/${product.slug}`;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      oldPrice: product.oldPrice,
      color,
      storage,
      quantity,
    });
    toast("Produto adicionado ao carrinho.");
    openCart();
  };

  const handleWhatsApp = () => {
    const msg = buildProductWhatsAppMessage(
      product.name,
      product.price,
      productUrl
    );
    window.open(getWhatsAppUrl(msg), "_blank");
  };

  const handleFavorite = () => {
    const added = toggleFavorite(product.id);
    toast(added ? "Adicionado aos favoritos." : "Removido dos favoritos.");
  };

  return (
    <div className="container-store py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          {
            label: product.category,
            href: `/categoria/${product.categorySlug}`,
          },
          { label: product.name },
        ]}
      />

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <Link
            href={`/categoria/${product.categorySlug}`}
            className="text-sm font-medium text-brand-gray hover:text-brand-black"
          >
            {product.category}
          </Link>
          <h1 className="mt-1 text-2xl font-bold md:text-3xl">{product.name}</h1>

          {product.rating && (
            <Rating
              value={product.rating}
              reviews={product.reviews}
              demo
              className="mt-2"
            />
          )}

          <div className="mt-4">
            <Price
              price={product.price}
              oldPrice={product.oldPrice}
              installment={product.installment}
              size="lg"
            />
          </div>

          <p className="mt-2 text-sm">
            <LiveStockBadge slug={product.slug} fallbackStock={product.stock} />
          </p>

          {product.colors && product.colors.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold">Cor</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm transition-colors",
                      color === c
                        ? "border-brand-purple bg-brand-purple/10 font-semibold"
                        : "border-brand-border hover:border-brand-black"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.storage && product.storage.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-semibold">Armazenamento</p>
              <div className="flex flex-wrap gap-2">
                {product.storage.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStorage(s)}
                    className={cn(
                      "rounded-lg border px-4 py-2 text-sm transition-colors",
                      storage === s
                        ? "border-brand-purple bg-brand-purple/10 font-semibold"
                        : "border-brand-border hover:border-brand-black"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold">Quantidade</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="rounded-lg border border-brand-border px-3 py-1.5 text-lg hover:bg-brand-light"
                aria-label="Diminuir"
              >
                −
              </button>
              <span className="w-8 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="rounded-lg border border-brand-border px-3 py-1.5 text-lg hover:bg-brand-light"
                aria-label="Aumentar"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8 hidden flex-col gap-3 sm:flex">
            <button
              onClick={handleAddToCart}
              disabled={!product.stock}
              className="btn-primary w-full disabled:opacity-50"
            >
              <ShoppingCart className="h-5 w-5" />
              Adicionar ao carrinho
            </button>
            <button onClick={handleWhatsApp} className="btn-outline w-full">
              <MessageCircle className="h-5 w-5" />
              Comprar pelo WhatsApp
            </button>
            <button
              onClick={handleFavorite}
              className="btn-outline w-full"
            >
              <Heart
                className="h-5 w-5"
                fill={isFavorite ? "currentColor" : "none"}
              />
              {isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            </button>
          </div>
        </div>
      </div>

      {/* Product info tabs */}
      <div className="mt-12 border-t border-brand-border pt-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-3 text-lg font-bold">Descrição</h2>
            <p className="text-sm leading-relaxed text-brand-gray">
              {product.description}
            </p>
          </div>
          {product.specs && (
            <div>
              <h2 className="mb-3 text-lg font-bold">Especificações</h2>
              <dl className="space-y-2">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <dt className="text-brand-gray">{key}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          {product.inBox && (
            <div>
              <h2 className="mb-3 text-lg font-bold">Conteúdo da embalagem</h2>
              <ul className="list-inside list-disc text-sm text-brand-gray">
                {product.inBox.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          {product.warranty && (
            <div>
              <h2 className="mb-3 text-lg font-bold">Garantia</h2>
              <p className="text-sm text-brand-gray">{product.warranty}</p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-8 text-2xl font-bold">Você também pode gostar</h2>
          <ProductGrid products={related} />
        </section>
      )}

      {/* Mobile sticky bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-brand-border bg-white p-3 sm:hidden">
        <div className="flex items-center gap-3">
          <Price price={product.price} size="sm" className="shrink-0" />
          <button
            onClick={handleAddToCart}
            disabled={!product.stock}
            className="btn-primary flex-1 py-2.5 text-xs disabled:opacity-50"
          >
            Adicionar
          </button>
          <button
            onClick={handleWhatsApp}
            className="btn-secondary flex-1 py-2.5 text-xs"
          >
            Comprar
          </button>
        </div>
      </div>
      <div className="h-20 sm:hidden" />
    </div>
  );
}
