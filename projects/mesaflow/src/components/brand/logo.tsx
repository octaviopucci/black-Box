import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/assets";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { cn } from "@/lib/cn";

type Props = {
  variant?: "horizontal" | "vertical" | "icon";
  href?: string | null;
  className?: string;
  iconSize?: number;
  showTagline?: boolean;
};

function Wordmark({ className, size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const text =
    size === "lg"
      ? "text-4xl sm:text-5xl"
      : size === "sm"
        ? "text-base"
        : "text-xl sm:text-2xl";

  return (
    <p
      className={cn(
        "font-[family-name:var(--font-display)] font-extrabold leading-none tracking-tight",
        text,
        className,
      )}
      aria-label={BRAND_NAME}
    >
      <span className="text-ink">NA </span>
      <span className="text-gradient-brand">MESA</span>
    </p>
  );
}

function Tagline({ className }: { className?: string }) {
  return (
    <p
      className={cn(
        "text-[10px] font-semibold uppercase tracking-[0.22em] text-muted",
        className,
      )}
    >
      {BRAND_TAGLINE}
    </p>
  );
}

export function Logo({
  variant = "horizontal",
  href = "/",
  className,
  iconSize = 40,
  showTagline = false,
}: Props) {
  const wrap = (children: React.ReactNode) =>
    href != null ? (
      <Link href={href} className={cn("inline-block", className)}>
        {children}
      </Link>
    ) : (
      <div className={cn("inline-block", className)}>{children}</div>
    );

  if (variant === "icon") {
    return wrap(
      <Image
        src={asset("/brand/logo-icon.png")}
        alt={BRAND_NAME}
        width={iconSize}
        height={iconSize}
        className="shrink-0"
        priority
      />,
    );
  }

  if (variant === "vertical") {
    return wrap(
      <div className="flex flex-col items-center text-center">
        <Image
          src={asset("/brand/logo-icon.png")}
          alt=""
          width={96}
          height={96}
          className="mb-6 h-24 w-24"
          aria-hidden
          priority
        />
        <Wordmark size="lg" />
        <div className="mt-4 flex w-full max-w-[220px] items-center gap-3">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-brand/60" />
          <Tagline className="shrink-0 text-[9px]" />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-brand/60" />
        </div>
      </div>,
    );
  }

  return wrap(
    <div className="inline-flex items-center gap-2.5">
      <Image
        src={asset("/brand/logo-icon.png")}
        alt=""
        width={iconSize}
        height={iconSize}
        className="shrink-0"
        aria-hidden
        priority
      />
      <div>
        <Wordmark size="sm" className="text-lg sm:text-xl" />
        {showTagline && <Tagline className="mt-1" />}
      </div>
    </div>,
  );
}
