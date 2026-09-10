"use client";

import { site } from "@/data/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { Reveal } from "@/components/motion/reveal";
import { MagneticButton } from "@/components/ui/magnetic-button";

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2 12L12 2M12 2H5M12 2V9"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CtaBand() {
  return (
    <section id="contato" className="px-6 py-24 md:py-32">
      <Reveal>
        <div className="bezel-outer mx-auto max-w-5xl">
          <div className="bezel-inner relative overflow-hidden px-8 py-16 text-center md:px-16 md:py-20">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-champagne/30 via-transparent to-surface/50" />
            <div className="relative">
              <p className="text-[10px] uppercase tracking-[0.22em] text-mute">
                Próximo passo
              </p>
              <h2 className="mt-4 font-display text-4xl font-light text-ink md:text-5xl">
                Reserve seu horário
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-base text-mute">
                Envie uma mensagem pelo Instagram para agendar sua avaliação e
                conhecer o protocolo ideal para a sua pele.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <MagneticButton
                  icon={<ArrowIcon />}
                  onClick={() => window.open(whatsappUrl(), "_blank")}
                >
                  {site.instagram.handle}
                </MagneticButton>
              </div>
              <p className="mt-8 text-xs text-mute">
                {site.location.city} · {site.location.address}
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
