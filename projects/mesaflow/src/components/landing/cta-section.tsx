import Link from "next/link";
import { LANDING_WHATSAPP_URL } from "@/components/landing/landing-data";

export function CtaSection() {
  return (
    <section id="contato" className="scroll-mt-16 py-12">
      <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] px-6 py-10 text-center shadow-[0_20px_48px_-24px_rgba(0,0,0,0.9)] sm:px-10">
        <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-extrabold leading-tight">Quer ver na prática?</h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Chama no WhatsApp ou olha os planos de novo. A gente explica sem enrolação.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="#planos"
            className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3.5 text-base font-bold text-[#111] shadow-[0_8px_24px_-6px_rgba(255,106,0,0.55)] transition hover:bg-brand-dark"
          >
            Ver planos
          </Link>
          {/* TODO: trocar 55XXXXXXXXXXX pelo WhatsApp real antes de publicar */}
          <a
            href={LANDING_WHATSAPP_URL}
            rel="noopener noreferrer"
            target="_blank"
            className="inline-flex items-center justify-center rounded-full border border-[#444] bg-[#151515] px-6 py-3.5 text-base font-bold transition hover:border-brand/50"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
