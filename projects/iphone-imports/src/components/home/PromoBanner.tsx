import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PromoBannerProps {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  variant?: "yellow" | "dark";
}

export function PromoBanner({
  title,
  description,
  ctaLabel,
  ctaHref,
  variant = "yellow",
}: PromoBannerProps) {
  const isYellow = variant === "yellow";

  return (
    <section
      className={
        isYellow
          ? "relative overflow-hidden rounded-3xl bg-brand-yellow p-8 md:p-12"
          : "relative overflow-hidden rounded-3xl bg-brand-black p-8 md:p-12"
      }
    >
      {!isYellow && <div className="absolute inset-0 grid-pattern opacity-40" />}
      {!isYellow && (
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-brand-yellow/10 to-transparent" />
      )}

      <div className="relative max-w-xl">
        <div className={isYellow ? "accent-line mb-4 bg-brand-black" : "accent-line mb-4"} />
        <h2
          className={`text-2xl font-black md:text-4xl ${isYellow ? "text-brand-black" : "text-white"}`}
        >
          {title}
        </h2>
        <p
          className={`mt-3 text-base ${isYellow ? "text-brand-black/70" : "text-brand-gray"}`}
        >
          {description}
        </p>
        <Link
          href={ctaHref}
          className={
            isYellow
              ? "mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-black px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
              : "btn-primary mt-6"
          }
        >
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
