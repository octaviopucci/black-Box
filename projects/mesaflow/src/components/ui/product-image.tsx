"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { resolveProductEmoji } from "@/lib/product-emoji";
import { isStockProductImageUrl } from "@/lib/product-images";

type Props = {
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  /** @deprecated Ignorado — sem imagem não exibimos placeholder. */
  seed?: string;
};

export function hasProductImage(src?: string | null): boolean {
  if (!src?.trim()) return false;
  if (isStockProductImageUrl(src)) return false;
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function ProductImage({ src, alt, width, height, className }: Props) {
  const [failed, setFailed] = useState(false);

  if (!hasProductImage(src) || failed) return null;

  return (
    <Image
      src={src!}
      alt={alt}
      width={width}
      height={height}
      className={cn("transition-opacity duration-300", className)}
      onError={() => setFailed(true)}
    />
  );
}

type ProductVisualProps = {
  src?: string;
  alt: string;
  productName?: string;
  categoryEmoji?: string;
  categoryName?: string;
  width: number;
  height: number;
  className?: string;
  emojiClassName?: string;
};

/** Foto real quando existir; senão emoji (categoria → nome → 🍽️); senão nada. */
export function ProductVisual({
  src,
  alt,
  productName,
  categoryEmoji,
  categoryName,
  width,
  height,
  className,
  emojiClassName,
}: ProductVisualProps) {
  if (hasProductImage(src)) {
    return <ProductImage src={src} alt={alt} width={width} height={height} className={className} />;
  }
  const emoji = resolveProductEmoji({
    productName: productName || alt,
    categoryEmoji,
    categoryName,
  });
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center leading-none", emojiClassName)}
      aria-hidden
    >
      {emoji}
    </span>
  );
}
