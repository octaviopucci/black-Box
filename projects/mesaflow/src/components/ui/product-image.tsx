"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

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
  if (!src) return false;
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
  categoryEmoji?: string;
  width: number;
  height: number;
  className?: string;
  emojiClassName?: string;
};

/** Foto real quando existir; senão emoji da categoria; senão nada (só texto nos pais). */
export function ProductVisual({
  src,
  alt,
  categoryEmoji,
  width,
  height,
  className,
  emojiClassName,
}: ProductVisualProps) {
  if (hasProductImage(src)) {
    return <ProductImage src={src} alt={alt} width={width} height={height} className={className} />;
  }
  if (categoryEmoji) {
    return (
      <span
        className={cn("inline-flex shrink-0 items-center justify-center leading-none", emojiClassName)}
        aria-hidden
      >
        {categoryEmoji}
      </span>
    );
  }
  return null;
}
