import Image from "next/image";
import Link from "next/link";
import { heroImages } from "@/data/images";

const highlights = [
  { src: heroImages.iphone, alt: "iPhones", href: "/categoria/iphones" },
  { src: heroImages.airpods, alt: "AirPods e fones", href: "/categoria/airpods-fones" },
  { src: heroImages.watch, alt: "Smartwatches", href: "/categoria/smartwatches" },
  { src: heroImages.charger, alt: "Carregadores", href: "/categoria/carregadores" },
];

export function HomeHighlightImages() {
  return (
    <section className="border-y border-brand-border bg-brand-dark py-6 md:py-8">
      <div className="container-store">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {highlights.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group overflow-hidden rounded-2xl border border-brand-border bg-brand-surface/80 p-3 transition-all hover:border-brand-purple/50 hover:shadow-[0_8px_32px_rgba(188,0,255,0.12)]"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-brand-black/40">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 text-center text-xs font-bold text-white">{item.alt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
