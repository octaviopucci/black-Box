import { Button } from "@/components/ui/Button";

interface PromoBannerProps {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  variant?: "light" | "dark";
}

export function PromoBanner({
  title,
  description,
  ctaLabel,
  ctaHref,
  variant = "light",
}: PromoBannerProps) {
  const isDark = variant === "dark";

  return (
    <section
      className={
        isDark
          ? "rounded-2xl bg-brand-black p-8 md:p-12"
          : "rounded-2xl bg-brand-light p-8 md:p-12"
      }
    >
      <div className="max-w-lg">
        <h2
          className={`text-2xl font-bold md:text-3xl ${isDark ? "text-white" : "text-brand-black"}`}
        >
          {title}
        </h2>
        <p
          className={`mt-2 ${isDark ? "text-brand-gray" : "text-brand-gray"}`}
        >
          {description}
        </p>
        <div className="mt-6">
          <Button
            href={ctaHref}
            variant={isDark ? "primary" : "secondary"}
          >
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
