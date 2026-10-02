"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Reveal } from "@/components/motion/reveal"
import { faq } from "@/data/site"

export function Faq() {
  return (
    <section
      id="duvidas"
      className="border-t border-[hsl(var(--ink)/0.06)] bg-[hsl(var(--paper))] py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="grid gap-12 md:grid-cols-[1fr_1.2fr] md:gap-16">
          <Reveal>
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[hsl(var(--accent))]">
              Dúvidas
            </p>
            <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] leading-[1.05] text-[hsl(var(--ink))]">
              Perguntas frequentes
            </h2>
            <p className="mt-4 text-[hsl(var(--mute))]">
              Respostas diretas sobre consulta, convênio e tratamentos. Ainda
              com dúvida? Fale conosco pelo WhatsApp.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <Accordion defaultValue={[faq[0].q]}>
              {faq.map((item) => (
                <AccordionItem key={item.q} value={item.q}>
                  <AccordionTrigger className="py-5 text-base text-[hsl(var(--ink))] hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-[hsl(var(--mute))]">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
