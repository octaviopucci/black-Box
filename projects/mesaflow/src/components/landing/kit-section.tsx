import Image from "next/image";
import { Check } from "lucide-react";
import { KIT_BULLETS } from "@/components/landing/landing-data";
import { asset } from "@/lib/assets";

export function KitSection() {
  return (
    <section id="kit" className="scroll-mt-16 py-12">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <figure className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] shadow-[0_16px_40px_-20px_rgba(0,0,0,0.85)]">
          <Image
            src={asset("/landing/kit.jpg")}
            alt="Kit NA MESA — placa com QR na mesa"
            width={800}
            height={520}
            loading="lazy"
            className="h-auto w-full"
            sizes="(min-width: 1024px) 42vw, 100vw"
          />
        </figure>
        <div>
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold leading-tight">O que você leva</h2>
          <p className="mt-2 text-muted">Kit na mesa, sistema rodando e gente do lado — não só software.</p>
          <ul className="mt-6 grid gap-4">
            {KIT_BULLETS.map(({ title, text }) => (
              <li
                key={title}
                className="flex gap-3 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-4"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="mt-1 text-sm text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
