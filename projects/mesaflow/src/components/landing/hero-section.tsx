import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/assets";

export function HeroSection() {
  return (
    <section className="py-9 sm:py-10">
      <div className="grid items-center gap-7 md:grid-cols-[1.1fr_0.9fr] md:gap-8">
        <div>
          <h1 className="text-[clamp(1.7rem,4.5vw,2.6rem)] font-extrabold leading-[1.15] tracking-tight">
            Pedido na mesa sem fila no balcão
          </h1>
          <p className="mt-2 max-w-[34rem] text-[1.05rem] font-bold text-brand">
            NA MESA. O cliente pede no celular, a cozinha recebe, a conta fecha sem briga.
          </p>
          <p className="mt-3 max-w-[34rem] text-muted">
            Feito pra rodízio, bar, casa de carne, padaria com mesa e restaurante que vive do salão — não de
            delivery.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            <Link
              href="#planos"
              className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-[0.95rem] font-bold text-[#111] transition hover:bg-brand-dark"
            >
              Quero ver os planos
            </Link>
            <Link
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-full border border-[#444] bg-transparent px-5 py-3 text-[0.95rem] font-bold transition hover:border-brand/40"
            >
              Me mostra como funciona
            </Link>
          </div>
        </div>
        <figure className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a]">
          <Image
            src={asset("/landing/hero.jpg")}
            alt="Salão de restaurante com pedido na mesa pelo celular — NA MESA"
            width={960}
            height={540}
            priority
            className="h-auto w-full"
            sizes="(min-width: 760px) 45vw, 100vw"
          />
        </figure>
      </div>
    </section>
  );
}
