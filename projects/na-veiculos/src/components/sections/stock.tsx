"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { availableBrands, availableVehicles, formatPrice } from "@/data/vehicles";
import { asset } from "@/lib/assets";
import { openWhatsApp, vehicleInterestMessage } from "@/lib/whatsapp";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import { useVehicleSelection } from "@/components/vehicle-selection";
import { cn } from "@/lib/utils";

const ALL = "all";

function specLine(v: (typeof availableVehicles)[number]) {
  return [v.brand, v.year, v.transmission, v.fuel].filter(Boolean).join(" · ");
}

export function Stock() {
  const [filter, setFilter] = useState<string>(ALL);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { chooseAndGo } = useVehicleSelection();

  const items = useMemo(() => {
    if (filter === ALL) return availableVehicles;
    return availableVehicles.filter((v) => v.brand === filter);
  }, [filter]);

  const total = items.length;
  const goLightbox = (direction: -1 | 1) =>
    setLightboxIndex((i) => (i === null ? i : (i + direction + total) % total));

  const lightboxOpen = lightboxIndex !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const skipRestoreRef = useRef(false);
  useEffect(() => {
    if (!lightboxOpen) return;
    // Foco entra no diálogo e volta pro card que abriu ao fechar.
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";

    const step = (direction: -1 | 1) =>
      setLightboxIndex((i) => (i === null ? i : (i + direction + total) % total));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
      if (event.key === "Escape") setLightboxIndex(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      if (!skipRestoreRef.current) opener?.focus();
      skipRestoreRef.current = false;
    };
  }, [lightboxOpen, total]);

  const current = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <section id="estoque" className="bg-paper py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeader
            index="003"
            label="Estoque"
            title={`${availableVehicles.length} carros disponíveis agora na loja — toque no carro para ver detalhes e pedir pelo WhatsApp.`}
          />
        </Reveal>

        <Reveal delay={0.06} className="mt-10 flex flex-wrap gap-2">
          {[ALL, ...availableBrands].map((brand) => (
            <button
              key={brand}
              type="button"
              aria-pressed={filter === brand}
              onClick={() => {
                setFilter(brand);
                setLightboxIndex(null);
              }}
              className={cn(
                "px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-colors",
                filter === brand
                  ? "bg-ink text-paper"
                  : "border border-line text-mute hover:border-ink hover:text-ink",
              )}
            >
              {brand === ALL ? "Todos" : brand}
            </button>
          ))}
        </Reveal>

        <div className="mt-12 grid gap-px bg-line/30 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((vehicle, index) => (
            <Reveal key={vehicle.id} delay={Math.min(index, 8) * 0.04}>
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                className="group relative flex aspect-[4/5] w-full flex-col justify-end bg-surface p-6 text-left transition-colors hover:bg-elevated"
              >
                <div className="absolute inset-0 overflow-hidden">
                  <Image
                    src={asset(vehicle.image)}
                    alt={vehicle.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover opacity-70 transition-all duration-500 group-hover:scale-[1.03] group-hover:opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/60 to-transparent" />
                </div>

                <div className="relative z-10">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
                    {specLine(vehicle)}
                  </p>
                  <h3 className="mt-2 text-lg font-medium text-ink">{vehicle.title}</h3>
                  <p className="mt-1 font-mono text-sm text-accent-soft">
                    {formatPrice(vehicle.price)}
                  </p>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {current && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-paper/96 p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            ref={closeRef}
            type="button"
            className="absolute right-5 top-5 z-10 text-ink"
            onClick={() => setLightboxIndex(null)}
            aria-label="Fechar"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goLightbox(-1);
            }}
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-line bg-surface"
            aria-label="Anterior"
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goLightbox(1);
            }}
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-line bg-surface"
            aria-label="Próximo"
          >
            <ChevronRight />
          </button>

          <div
            className="grid max-h-[90vh] w-full max-w-5xl gap-6 overflow-y-auto bg-surface p-4 ring-1 ring-line/40 md:grid-cols-[3fr_2fr] md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                key={current.id}
                src={asset(current.image)}
                alt={current.title}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
                {specLine(current)}
              </p>
              <h3 className="mt-2 text-2xl font-medium leading-tight text-ink">
                {current.title}
              </h3>
              <p className="mt-2 font-mono text-xl text-accent-soft">
                {formatPrice(current.price)}
              </p>

              {current.highlights.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {current.highlights.map((item) => (
                    <li
                      key={item}
                      className="border border-line/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-mute"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-auto flex flex-col gap-3 pt-8">
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    skipRestoreRef.current = true;
                    setLightboxIndex(null);
                    chooseAndGo(current.id);
                  }}
                >
                  Quero este carro
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => openWhatsApp(vehicleInterestMessage(current))}
                >
                  Perguntar no WhatsApp
                </button>
                <p className="font-mono text-[10px] tracking-widest text-mute/60">
                  {lightboxIndex + 1} / {items.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
