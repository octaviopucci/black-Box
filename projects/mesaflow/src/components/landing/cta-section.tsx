import Link from "next/link";
import { LANDING_WHATSAPP_URL } from "@/components/landing/landing-data";

export function CtaSection() {
  return (
    <section id="contato" className="scroll-mt-16 py-11">
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] px-5 py-8 text-center">
        <h2 className="text-[clamp(1.35rem,3vw,1.85rem)] font-extrabold leading-tight">Quer ver na prática?</h2>
        <p className="mx-auto mt-2 max-w-[28rem] text-muted">
          Chama no WhatsApp ou olha os planos de novo. A gente explica sem enrolação.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          <Link
            href="#planos"
            className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-[0.95rem] font-bold text-[#111] transition hover:bg-brand-dark"
          >
            Ver planos
          </Link>
          {/* TODO: trocar 55XXXXXXXXXXX pelo WhatsApp real antes de publicar */}
          <a
            href={LANDING_WHATSAPP_URL}
            rel="noopener noreferrer"
            target="_blank"
            className="inline-flex items-center justify-center rounded-full border border-[#444] bg-transparent px-5 py-3 text-[0.95rem] font-bold transition hover:border-brand/40"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
