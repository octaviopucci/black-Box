"use client";

import Image from "next/image";
import { useState } from "react";
import { PRODUCT_IMAGES, productImage, productImageByName } from "@/lib/product-images";
import { cn } from "@/lib/cn";

type Props = {
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  seed?: string;
};

function isUsableImageSource(src: string | undefined): src is string {
  if (!src) return false;
  if (src.startsWith("/")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function ProductImage({ src, alt, width, height, className, seed = "mesaflow-food" }: Props) {
  const [failedSrc, setFailedSrc] = useState<string | undefined>();
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const failed = Boolean(src && failedSrc === src);
  const resolved =
    failed || !isUsableImageSource(src)
      ? PRODUCT_IMAGES[seed] ?? productImageByName(alt) ?? productImage(seed, "default")
      : src;

  return (
    <Image
      src={resolved}
      alt={alt}
      width={width}
      height={height}
      className={cn("bg-surface-3 transition-opacity duration-300", loadedSrc === resolved ? "opacity-100" : "opacity-60", className)}
      aria-busy={loadedSrc !== resolved}
      onLoad={() => setLoadedSrc(resolved)}
      onError={() => setFailedSrc(src)}
    />
  );
}
