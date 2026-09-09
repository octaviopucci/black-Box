"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-light">
        <Image
          src={images[active]}
          alt={`${name} - imagem ${active + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-6 transition-opacity duration-200"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-brand-light transition-colors",
                active === i ? "border-brand-yellow" : "border-transparent"
              )}
              aria-label={`Ver imagem ${i + 1}`}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="64px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
