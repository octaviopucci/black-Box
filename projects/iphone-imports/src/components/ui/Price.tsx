import { formatCurrency, calculateDiscountPercent } from "@/lib/formatCurrency";
import { cn } from "@/lib/utils";

interface PriceProps {
  price: number;
  oldPrice?: number;
  installment?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Price({
  price,
  oldPrice,
  installment,
  size = "md",
  className,
}: PriceProps) {
  const discount = calculateDiscountPercent(price, oldPrice);

  const sizeClasses = {
    sm: { current: "text-sm font-bold", old: "text-xs" },
    md: { current: "text-lg font-bold", old: "text-sm" },
    lg: { current: "text-2xl font-bold", old: "text-base" },
  };

  return (
    <div className={cn("flex flex-col gap-0.5", className)}>
      {oldPrice && oldPrice > price && (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-brand-gray line-through",
              sizeClasses[size].old
            )}
          >
            {formatCurrency(oldPrice)}
          </span>
          {discount && (
            <span className="badge-sale">{discount}% OFF</span>
          )}
        </div>
      )}
      <span className={cn("text-brand-black", sizeClasses[size].current)}>
        {formatCurrency(price)}
      </span>
      {installment && (
        <span className="text-xs text-brand-gray">{installment}</span>
      )}
    </div>
  );
}
