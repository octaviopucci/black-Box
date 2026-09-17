import { cn } from "@/lib/cn";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
};

export function Button({ className, variant = "primary", size = "md", loading, children, ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition active:scale-[0.98] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        size === "sm" && "px-3 py-2 text-sm",
        size === "md" && "px-4 py-3 text-sm",
        size === "lg" && "px-5 py-4 text-base",
        variant === "primary" && "bg-brand text-white shadow-lg shadow-brand/25 hover:bg-brand-dark hover:shadow-brand/30",
        variant === "secondary" && "border border-white/8 bg-surface-3 text-ink hover:border-brand/20 hover:bg-surface-2",
        variant === "ghost" && "bg-transparent text-muted hover:bg-white/5 hover:text-ink",
        variant === "danger" && "bg-danger text-white",
        className,
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? "Aguarde…" : children}
    </button>
  );
}
