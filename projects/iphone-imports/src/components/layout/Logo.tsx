import Link from "next/link";
import { Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconClassName?: string;
  asLink?: boolean;
}

export function Logo({ className, iconClassName, asLink = true }: LogoProps) {
  const content = (
    <span className={cn("inline-flex items-center gap-2 font-black tracking-tight", className)}>
      <Smartphone
        className={cn("h-5 w-5 shrink-0 text-brand-silver md:h-6 md:w-6", iconClassName)}
        aria-hidden
      />
      <span className="text-lg md:text-xl">
        <span className="text-white">iPhone </span>
        <span className="text-gradient-brand">Imports</span>
      </span>
    </span>
  );

  if (!asLink) return content;

  return (
    <Link href="/" className="shrink-0 transition-opacity hover:opacity-90">
      {content}
    </Link>
  );
}
