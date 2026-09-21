import Image from "next/image";
import { asset } from "@/lib/assets";

export function DesireSection() {
  return (
    <section id="desejo" className="scroll-mt-16 py-12">
      <div className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#151515] shadow-[0_20px_48px_-24px_rgba(0,0,0,0.9)]">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <figure className="relative min-h-[220px] lg:min-h-[360px]">
            <Image
              src={asset("/landing/desejo.jpg")}
              alt="Salão cheio, mesas girando — NA MESA"
              fill
              loading="lazy"
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </figure>
          <div className="px-6 py-8 sm:px-8 sm:py-10 lg:py-12">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">O que você quer ver</p>
            <h2 className="mt-3 text-[clamp(1.5rem,3vw,2.1rem)] font-extrabold leading-tight">
              Salão girando. Conta sem briga.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Mesa que vira, pedido certo na cozinha, fechamento limpo. NA MESA organiza o fluxo — você fica no
              salão, não apagando incêndio no balcão.
            </p>
            <p className="mt-4 text-base font-semibold text-[#ececec]">
              Menos fila. Menos erro na conta. Mais giro na hora de pico.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
