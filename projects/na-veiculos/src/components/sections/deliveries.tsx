"use client";

import { useState } from "react";
import Image from "next/image";
import { soldVehicles } from "@/data/vehicles";
import { asset } from "@/lib/assets";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";

const INITIAL = 6;

export function Deliveries() {
  const [showAll, setShowAll] = useState(false);
  const items = showAll ? soldVehicles : soldVehicles.slice(0, INITIAL);

  return (
    <section id="entregas" className="bg-surface py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal>
          <SectionHeader
            index="004"
            label="Entregas"
            title={`${soldVehicles.length} sonhos entregues recentemente — cada carro aqui saiu da loja com a chave na mão de um cliente da região.`}
          />
        </Reveal>

        <div className="mt-16 space-y-0">
          {items.map((vehicle, index) => (
            <Reveal key={vehicle.id} delay={Math.min(index, 5) * 0.06}>
              <article className="grid gap-6 border-t border-line/40 py-10 md:grid-cols-[80px_1fr_112px] md:items-start">
                <span className="font-mono text-4xl font-light text-line">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                    Vendido
                  </p>
                  <h3 className="mt-2 text-lg font-medium text-ink md:text-xl">
                    {vehicle.title}
                  </h3>
                  {vehicle.praise && (
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-mute">
                      “{vehicle.praise}”
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {[vehicle.brand, vehicle.year].filter(Boolean).map((tag) => (
                      <span
                        key={String(tag)}
                        className="border border-line/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-mute"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={vehicle.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portfolio-frame group relative hidden aspect-square md:block"
                  aria-label={`${vehicle.title} no Instagram`}
                >
                  <Image
                    src={asset(vehicle.image)}
                    alt=""
                    fill
                    loading="lazy"
                    sizes="112px"
                    className="portfolio-img"
                  />
                </a>
              </article>
            </Reveal>
          ))}
        </div>

        {soldVehicles.length > INITIAL && (
          <div className="mt-6 border-t border-line/40 pt-8">
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              className="font-mono text-[11px] uppercase tracking-[0.25em] text-mute transition-colors hover:text-ink"
            >
              {showAll
                ? "← Mostrar menos"
                : `Ver todas as ${soldVehicles.length} entregas →`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
