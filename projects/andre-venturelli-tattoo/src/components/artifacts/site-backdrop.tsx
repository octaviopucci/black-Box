"use client";

import { PhotoRoll } from "@/components/artifacts/photo-roll";
import { ParticleField } from "@/components/artifacts/particle-field";

/** Rolo + partículas fixos no canto direito durante todo o scroll do site. */
export function SiteBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-y-0 right-0 z-[2] left-[52%] md:left-[42%]"
      aria-hidden
    >
      <PhotoRoll fixed className="absolute inset-0" />
      <ParticleField scrollProgress={0} />
    </div>
  );
}
