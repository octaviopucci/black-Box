"use client";

import Image from "next/image";
import { useState } from "react";
import { PRODUCT_IMAGES, productImage, productImageByName } from "@/lib/product-images";

type Props = {
  src?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  seed?: string;
};

export function ProductImage({ src, alt, width, height, className, seed = "mesaflow-food" }: Props) {
  const [failed, setFailed] = useState(false);
  const resolved =
    failed || !src
      ? PRODUCT_IMAGES[seed] ?? productImageByName(alt) ?? productImage(seed, "default")
      : src;

  return (
    <Image
      src={resolved}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
