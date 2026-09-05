import Image from "next/image";
import { forwardRef } from "react";
import { availableVehicles } from "@/data/vehicles";
import { asset } from "@/lib/assets";

type HeroFilmRollsProps = {
  side: "left" | "right";
};

function pickImages(side: "left" | "right") {
  const pool = availableVehicles.map((v) => v.image);
  const offset = side === "left" ? 0 : 4;
  const picked: string[] = [];
  for (let i = 0; i < 12; i += 1) {
    picked.push(pool[(offset + i) % pool.length]!);
  }
  return [...picked, ...picked];
}

export const HeroFilmRolls = forwardRef<HTMLDivElement, HeroFilmRollsProps>(
  function HeroFilmRolls({ side }, ref) {
    const images = pickImages(side);
    const align = side === "left" ? "items-start pl-2 md:pl-6" : "items-end pr-2 md:pr-6";

    return (
      <div
        ref={ref}
        className={`pointer-events-none absolute inset-y-0 ${side === "left" ? "left-0" : "right-0"} z-[1] hidden w-[34%] max-w-[220px] opacity-70 sm:flex ${align} md:max-w-[260px] md:opacity-100`}
        aria-hidden
      >
        <div className="film-strip flex h-[160%] w-[72px] flex-col gap-1 py-2 md:w-[92px]">
          {images.map((src, index) => (
            <div key={`${src}-${index}`} className="film-frame relative shrink-0">
              <Image
                src={asset(src)}
                alt=""
                fill
                sizes="92px"
                className="object-cover"
                loading={index < 4 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </div>
    );
  },
);
