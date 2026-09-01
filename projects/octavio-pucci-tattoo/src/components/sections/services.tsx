"use client";

import { MessageCircle } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { services } from "@/lib/site-config";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function Services() {
  return (
    <section id="servicos" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <h2 className="font-heading text-3xl text-foreground uppercase md:text-4xl">
          O que faço
        </h2>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">
          Cada trabalho é projeto fechado. Você sabe o valor antes de deitar na
          cadeira.
        </p>

        <ul className="mt-12 divide-y divide-border">
          {services.map((service) => (
            <li
              key={service.id}
              className="flex flex-col gap-4 py-8 first:pt-0 last:pb-0 md:flex-row md:items-start md:justify-between md:gap-8"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h3 className="text-xl font-semibold text-foreground">
                    {service.name}
                  </h3>
                  <span className="text-sm font-medium text-[var(--brand-accent)]">
                    {service.price}
                  </span>
                </div>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                  {service.description}
                </p>
              </div>
              <a
                href={buildWhatsAppUrl({ serviceName: service.name })}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "shrink-0 border-[var(--brand-accent)]/40 hover:bg-[var(--brand-accent)]/10",
                )}
              >
                <MessageCircle className="size-4" />
                Orçamento deste serviço
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
