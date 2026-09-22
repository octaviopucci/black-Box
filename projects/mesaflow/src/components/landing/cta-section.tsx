import Link from "next/link";
import { LANDING_WHATSAPP_URL } from "@/components/landing/landing-data";

export function CtaSection() {
  return (
    <section id="contato" className="scroll-mt-16 py-11">
      <div className="rounded-2xl border border-brand/30 bg-gradient-to-br from-brand/10 to-transparent px-5 py-10 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-brand">NA MESA</p>
        <h2 className="mt-2 text-[clamp(1.35rem,3vw,1.85rem)] font-extrabold leading-tight">
          Cliente pede. A operação recebe. A cozinha produz. A mesa continua andando.
        </h2>
        <p className="mx-auto mt-3 max-w-[32rem] font-semibold text-brand">
          Pedido na mesa. Comanda na cozinha.
        </p>
        <p className="mx-auto mt-2 max-w-[32rem] text-muted">
          R$997/ano · ≈ R$83/mês · Sistema + kit + implantação
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <a
            href={LANDING_WHATSAPP_URL}
            rel="noopener noreferrer"
            target="_blank"
            className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-[0.95rem] font-bold text-[#111] transition hover:bg-brand-dark"
          >
            Quero colocar o NA MESA na minha casa
          </a>
          <Link
            href="#planos"
            className="inline-flex items-center justify-center rounded-full border border-[#444] bg-transparent px-5 py-3 text-[0.95rem] font-bold transition hover:border-brand/40"
          >
            Ver planos
          </Link>
        </div>
        <p className="mx-auto mt-4 max-w-[28rem] text-sm text-muted">
          Fale conosco pelo WhatsApp e veja o sistema funcionando antes de decidir.
        </p>
      </div>
    </section>
  );
}
