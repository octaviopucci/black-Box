import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/assets";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { cn } from "@/lib/cn";

type Props = {
  variant?: "horizontal" | "vertical" | "icon" | "compact";
  href?: string | null;
  className?: string;
  iconSize?: number;
  showTagline?: boolean;
};

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
        className="h-auto w-auto shrink-0"
        style={{ maxHeight: iconSize, maxWidth: iconSize }}
        priority
      />,
    );
  }

  if (variant === "vertical") {
    return wrap(
      <Image
        src={asset("/brand/logo-vertical.png")}
        alt={`${BRAND_NAME} — ${BRAND_TAGLINE}`}
        width={280}
        height={420}
        className="h-auto w-full max-w-[280px]"
        priority
      />,
    );
  }

  const src = showTagline
    ? asset("/brand/logo-horizontal.png")
    : asset("/brand/logo-horizontal-compact.png");
  const width = showTagline ? 440 : 200;
  const height = showTagline ? 120 : 48;

  return wrap(
    <Image
      src={src}
      alt={`${BRAND_NAME} — ${BRAND_TAGLINE}`}
      width={width}
      height={height}
      className="h-auto w-auto"
      style={{ maxHeight: showTagline ? 96 : 40, maxWidth: showTagline ? 320 : 180 }}
      priority
    />,
  );
}
