import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PromoBannerProps {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  variant?: "silver" | "dark";
}

export function PromoBanner({
  title,
  description,
  ctaLabel,
  ctaHref,
  variant = "silver",
}: PromoBannerProps) {
  const isDark = variant === "dark";

  return (
    <section
      className={
        isDark
          ? "relative overflow-hidden rounded-3xl bg-brand-black p-8 md:p-12"
          : "relative overflow-hidden rounded-3xl border border-brand-border bg-gradient-to-br from-brand-elevated via-brand-surface to-brand-black p-8 md:p-12"
      }
    >
      {isDark && <div className="absolute inset-0 grid-pattern opacity-40" />}
      <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-brand-silver/10 to-transparent" />

      <div className="relative max-w-xl">
        <div className="accent-line mb-4" />
        <h2 className="text-2xl font-black text-white md:text-4xl">{title}</h2>
        <p className="mt-3 text-base text-brand-gray">{description}</p>
        <Link href={ctaHref} className="btn-primary mt-6 inline-flex items-center gap-2">
          {ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
