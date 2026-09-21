import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/assets";

const imageFrame =
  "overflow-hidden rounded-2xl border border-[#333] bg-[#1a1a1a] shadow-[0_28px_64px_-16px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,106,0,0.12)]";

export function HeroSection() {
  return (
    <section className="py-10 sm:py-14">
      <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-brand">NA MESA</p>
          <h1 className="mt-2 text-[clamp(2rem,5vw,3.15rem)] font-extrabold leading-[1.08] tracking-tight">
            Pedido na mesa sem fila no balcão
          </h1>
          <p className="mt-4 max-w-xl text-[clamp(1.05rem,2.2vw,1.2rem)] font-semibold leading-snug text-[#ececec]">
            O cliente pede no celular, a cozinha recebe, a conta fecha sem briga.
          </p>
          <p className="mt-3 max-w-xl text-base text-muted">
            Feito pra quem vive do salão — rodízio, bar, casa de carne e restaurante presencial. Não é delivery.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="#planos"
              className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3.5 text-base font-bold text-[#111] shadow-[0_8px_24px_-6px_rgba(255,106,0,0.55)] transition hover:bg-brand-dark"
            >
              Quero ver os planos
            </Link>
            <Link
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-full border border-[#444] bg-[#1a1a1a] px-6 py-3.5 text-base font-bold transition hover:border-brand/50"
            >
              Me mostra como funciona
            </Link>
          </div>
        </div>
        <figure className={imageFrame}>
          <Image
            src={asset("/landing/hero.jpg")}
            alt="Salão de restaurante com pedido na mesa pelo celular — NA MESA"
            width={1200}
            height={675}
            priority
            className="h-auto w-full"
            sizes="(min-width: 1024px) 52vw, 100vw"
          />
        </figure>
      </div>
    </section>
  );
}
