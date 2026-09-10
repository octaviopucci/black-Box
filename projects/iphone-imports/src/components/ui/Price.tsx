import { formatCurrency, calculateDiscountPercent } from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";

interface PriceProps {
  price: number;
  oldPrice?: number;
  installment?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  dark?: boolean;
}

export function Price({
  price,
  oldPrice,
  installment,
  size = "md",
  className,
  dark,
}: PriceProps) {
  const discount = calculateDiscountPercent(price, oldPrice);

  const sizeClasses = {
    sm: { current: "text-base font-black", old: "text-xs" },
    md: { current: "text-xl font-black", old: "text-sm" },
    lg: { current: "text-3xl font-black", old: "text-base" },
  };

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {oldPrice && oldPrice > price && (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "line-through",
              dark ? "text-brand-gray" : "text-brand-muted",
              sizeClasses[size].old
            )}
          >
            {formatCurrency(oldPrice)}
          </span>
          {discount && <span className="badge-sale">{discount}% OFF</span>}
        </div>
      )}
      <span
        className={cn(
          dark ? "text-brand-silver" : "text-brand-black",
          sizeClasses[size].current
        )}
      >
        {formatCurrency(price)}
      </span>
      {installment && (
        <span className={cn("text-xs", dark ? "text-brand-gray" : "text-brand-muted")}>
          {installment}
        </span>
      )}
    </div>
  );
}
