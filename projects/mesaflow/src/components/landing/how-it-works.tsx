import Image from "next/image";
import { HOW_IT_WORKS_STEPS } from "@/components/landing/landing-data";
import { asset } from "@/lib/assets";

export function HowItWorks() {
  return (
    <section id="como-funciona" className="scroll-mt-16 py-12">
      <div className="max-w-3xl">
        <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold leading-tight">Como funciona</h2>
        <p className="mt-2 text-muted">Quatro passos. Do QR na mesa até liberar pra próxima reserva.</p>
      </div>

      <ol className="mt-6 grid gap-3 sm:grid-cols-2">
        {HOW_IT_WORKS_STEPS.map((step, index) => (
          <li
            key={step}
            className="flex gap-3 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] p-4 text-muted"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-[#111]">
              {index + 1}
            </span>
            <span className="pt-1 text-sm leading-relaxed sm:text-[0.95rem]">{step}</span>
          </li>
        ))}
      </ol>

      <figure className="mt-8 overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] shadow-[0_16px_40px_-20px_rgba(0,0,0,0.85)]">
        <Image
          src={asset("/landing/produto.jpg")}
          alt="Cardápio no celular, tela da cozinha e operação NA MESA"
          width={1200}
          height={500}
          loading="lazy"
          className="h-auto w-full"
          sizes="(min-width: 960px) 960px, 100vw"
        />
        <figcaption className="border-t border-[#2a2a2a] px-5 py-3 text-sm text-muted">
          Cliente pede no celular · cozinha recebe · casa no controle do fechamento.
        </figcaption>
      </figure>
    </section>
  );
}
