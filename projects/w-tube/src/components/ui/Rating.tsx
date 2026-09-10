import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  reviews?: number;
  demo?: boolean;
  className?: string;
}

export function Rating({ value, reviews, demo, className }: RatingProps) {
  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              i < Math.floor(value)
                ? "fill-brand-purple text-brand-purple"
                : "fill-brand-border text-brand-border"
            )}
          />
        ))}
      </div>
      <span className="text-xs text-brand-gray">
        {value.toFixed(1)}
        {reviews !== undefined && ` (${reviews})`}
        {demo && " · demo"}
      </span>
    </div>
  );
}
