import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "Ver todos",
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-8 flex items-end justify-between gap-4", className)}>
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-brand-black md:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-brand-gray">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-black transition-colors hover:text-brand-yellow sm:flex"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
