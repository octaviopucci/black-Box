import Image from "next/image";
import { HOW_IT_WORKS_STEPS } from "@/components/landing/landing-data";
import { AdminOrdersMockup, KdsMockup } from "@/components/landing/product-mockups";
import { SectionShell } from "@/components/landing/section-shell";
import { asset } from "@/lib/assets";

export function HowItWorks() {
  return (
    <SectionShell id="como-funciona" title="Como funciona">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div>
          <ol className="grid gap-2.5">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <li key={step} className="grid grid-cols-[2rem_1fr] items-start gap-3 text-muted">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-[#111]">
                  {index + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-muted">
            Garçom também pode lançar pelo celular. Cliente e garçom usam o mesmo fluxo.
          </p>
        </div>
        <div className="grid gap-4">
          <figure className="overflow-hidden rounded-xl border border-[#2a2a2a]">
            <Image
              src={asset("/landing/kit/kit-placa-peca-pelo-celular.webp")}
              alt="Placa NA MESA: Peça pelo celular"
              width={720}
              height={900}
              loading="lazy"
              className="h-auto w-full"
              sizes="(min-width: 760px) 40vw, 100vw"
            />
          </figure>
          <div className="hidden sm:block">
            <AdminOrdersMockup />
          </div>
          <div className="hidden md:block">
            <KdsMockup />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
