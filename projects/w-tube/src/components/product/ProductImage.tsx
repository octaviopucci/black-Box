"use client";

import Image from "next/image";
import { useState } from "react";
import { getPrimaryImage, PRODUCT_IMAGE_FALLBACK } from "@/lib/product-image";
import type { Product } from "@/types";

interface ProductImageProps {
  product: Pick<Product, "images" | "name">;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
}

export function ProductImage({
  product,
  className,
  sizes,
  priority,
  fill = true,
  width,
  height,
}: ProductImageProps) {
  const primary = getPrimaryImage(product);
  const [src, setSrc] = useState(primary);

  const handleError = () => {
    if (src !== PRODUCT_IMAGE_FALLBACK) setSrc(PRODUCT_IMAGE_FALLBACK);
  };

  if (fill) {
    return (
      <Image
        src={src}
        alt={product.name}
        fill
        sizes={sizes}
        className={className}
        priority={priority}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={product.name}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
      priority={priority}
      onError={handleError}
    />
  );
}
