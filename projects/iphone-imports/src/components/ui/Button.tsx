import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  href?: string;
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
}

const variants: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
};

export function Button({
  variant = "primary",
  href,
  className,
  children,
  onClick,
  ...props
}: ButtonProps) {
  const classes = cn(variants[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
