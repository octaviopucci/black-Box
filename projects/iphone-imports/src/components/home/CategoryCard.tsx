import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface CategoryCardProps {
  name: string;
  slug: string;
  image: string;
}

export function CategoryCard({ name, slug, image }: CategoryCardProps) {
  const href = slug === "ofertas" ? "/ofertas" : `/categoria/${slug}`;

  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-2xl border border-brand-border-light bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-yellow hover:shadow-[0_12px_40px_rgba(255,212,0,0.15)]"
    >
      <div className="relative aspect-[4/3] product-image-bg overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, 16vw"
          className="object-contain p-5 transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
      <div className="flex items-center justify-between p-4">
        <h3 className="text-sm font-bold text-brand-black">{name}</h3>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-light text-brand-black transition-colors group-hover:bg-brand-yellow">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  );
}
