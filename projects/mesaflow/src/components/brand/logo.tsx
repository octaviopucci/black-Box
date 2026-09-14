import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/assets";
import { cn } from "@/lib/cn";

type Props = {
  variant?: "horizontal" | "vertical" | "icon";
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

  if (variant === "vertical") {
    return wrap(
      <Image
        src={asset("/brand/logo-vertical.png")}
        alt="MesaFlow — Seu pedido, sem espera"
        width={320}
        height={320}
        className="h-auto w-full max-w-[280px]"
        priority
      />,
    );
  }

  if (variant === "icon") {
    return wrap(
      <Image
        src={asset("/brand/logo-icon.png")}
        alt="MesaFlow"
        width={iconSize}
        height={iconSize}
        className="shrink-0"
        priority
      />,
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
        <p className="font-[family-name:var(--font-display)] text-xl font-bold leading-none tracking-tight">
          <span className="text-ink">Mesa</span>
          <span className="text-gradient-brand">Flow</span>
        </p>
        {showTagline && (
          <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted">
            Seu pedido, sem espera
          </p>
        )}
      </div>
    </div>,
  );
}
