import { availableVehicles } from "@/data/vehicles";
import { asset } from "@/lib/assets";
import { cn } from "@/lib/utils";

const COLUMN_COUNT = 7;

function pickImages(columnIndex: number) {
  const pool = availableVehicles.map((v) => v.image);
  const picked: string[] = [];
  for (let i = 0; i < 10; i += 1) {
    picked.push(pool[(columnIndex * 2 + i) % pool.length]!);
  }
  return [...picked, ...picked];
}

const DURATIONS = [38, 44, 36, 48, 40, 46, 42];

export function HeroFilmGrid() {
  return (
    <div className="absolute inset-0 z-0 flex gap-1 overflow-hidden sm:gap-1.5" aria-hidden>
      {Array.from({ length: COLUMN_COUNT }, (_, columnIndex) => {
        const images = pickImages(columnIndex);
        const direction = columnIndex % 2 === 0 ? "down" : "up";

        return (
          <div
            key={columnIndex}
            className={cn(
              "relative min-w-0 flex-1 overflow-hidden",
              columnIndex >= 5 && "hidden md:block",
            )}
          >
            <div
              className={cn(
                "film-roll-track flex flex-col gap-1 sm:gap-1.5",
                direction === "up" ? "film-roll-track--up" : "film-roll-track--down",
              )}
              style={{ animationDuration: `${DURATIONS[columnIndex] ?? 40}s` }}
            >
              {images.map((src, index) => (
                <div key={`${columnIndex}-${src}-${index}`} className="film-roll-frame shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(src)}
                    alt=""
                    loading={columnIndex < 2 && index < 2 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
