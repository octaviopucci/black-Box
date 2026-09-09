import Image from "next/image";
import Link from "next/link";

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
      className="group relative overflow-hidden rounded-2xl border border-brand-border bg-brand-light transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className="object-contain p-6 transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="text-sm font-semibold text-brand-black">{name}</h3>
      </div>
    </Link>
  );
}
