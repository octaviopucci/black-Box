import { forwardRef } from "react";
import { availableVehicles } from "@/data/vehicles";
import { asset } from "@/lib/assets";

type HeroFilmRollsProps = {
  side: "left" | "right";
};

function pickImages(side: "left" | "right") {
  const pool = availableVehicles.map((v) => v.image);
  const offset = side === "left" ? 0 : 5;
  const picked: string[] = [];
  for (let i = 0; i < 14; i += 1) {
    picked.push(pool[(offset + i) % pool.length]!);
  }
  return [...picked, ...picked];
}

export const HeroFilmRolls = forwardRef<HTMLDivElement, HeroFilmRollsProps>(
  function HeroFilmRolls({ side }, ref) {
    const images = pickImages(side);
    const edge = side === "left" ? "left-0 pl-1 sm:pl-3 md:pl-6" : "right-0 pr-1 sm:pr-3 md:pr-6";

    return (
      <div
        ref={ref}
        className={`pointer-events-none absolute inset-y-[-8%] ${edge} z-[1] flex w-[30%] max-w-[108px] items-start sm:max-w-[132px] md:max-w-[168px]`}
        aria-hidden
      >
        <div className="film-strip flex w-full flex-col gap-1.5 py-2">
          {images.map((src, index) => (
            <div key={`${src}-${index}`} className="film-frame shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(src)}
                alt=""
                loading={index < 3 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    );
  },
);
