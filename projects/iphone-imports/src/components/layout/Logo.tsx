import Link from "next/link";
import { Apple } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  asLink?: boolean;
}

export function Logo({ className, iconClassName, asLink = true }: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-1.5 font-black tracking-tight", className)}>
      <Apple
        className={cn("h-5 w-5 shrink-0 text-brand-yellow md:h-6 md:w-6", iconClassName)}
        aria-hidden
      />
      <span>
        <span className="text-white">iPhone </span>
        <span className="text-brand-yellow">Imports</span>
      </span>
    </span>
  );

  if (!asLink) return content;

  return (
    <Link href="/" className="shrink-0 text-lg md:text-xl">
      {content}
    </Link>
  );
}
