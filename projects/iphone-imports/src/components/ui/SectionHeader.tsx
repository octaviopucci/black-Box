import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  variant?: "light" | "dark";
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "Ver todos",
  className,
  variant = "light",
}: SectionHeaderProps) {
  const isDark = variant === "dark";

  return (
    <div className={cn("mb-8 flex items-end justify-between gap-4", className)}>
      <div>
        <div className="accent-line mb-3" />
        <h2
          className={cn(
            "text-2xl font-black tracking-tight md:text-3xl",
            isDark ? "text-white" : "text-brand-black"
          )}
        >
          {title}
        </h2>
        {subtitle && (
          <p className={cn("mt-1", isDark ? "text-brand-gray" : "text-brand-muted")}>
            {subtitle}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className={cn(
            "hidden shrink-0 items-center gap-1 text-sm font-bold transition-colors sm:flex",
            isDark
              ? "text-brand-silver hover:text-brand-silver-hover"
              : "text-brand-black hover:text-brand-silver"
          )}
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
