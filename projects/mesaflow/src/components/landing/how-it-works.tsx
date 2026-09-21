import Image from "next/image";
import { HOW_IT_WORKS_STEPS } from "@/components/landing/landing-data";
import { asset } from "@/lib/assets";

export function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-16 py-11">
      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-start">
        <div>
          <h2 className="text-[clamp(1.35rem,3vw,1.85rem)] font-extrabold leading-tight">Como funciona</h2>
          <ol className="mt-4 grid gap-2.5">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <li key={step} className="grid grid-cols-[2rem_1fr] items-start gap-3 text-muted">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-[#111]">
                  {index + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <figure className="max-w-[22rem] overflow-hidden rounded-[0.85rem] border border-[#2a2a2a] bg-[#1a1a1a] md:justify-self-end">
          <Image
            src={asset("/landing/kit.jpg")}
            alt="Placa com QR na mesa — kit NA MESA"
            width={720}
            height={405}
            loading="lazy"
            className="h-auto w-full"
            sizes="(min-width: 760px) 30vw, 100vw"
          />
          <figcaption className="px-3.5 py-2.5 text-sm text-muted">
            Placa/QR bonita na mesa — o cliente aponta e pede.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
