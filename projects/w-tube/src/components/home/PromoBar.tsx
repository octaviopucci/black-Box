import { storeConfig } from "@/config/store";
import { Star } from "lucide-react";

export function PromoBar() {
  return (
    <div className="brand-header-bg py-3">
      <div className="container-store flex items-center justify-center gap-2">
        <a
          href={storeConfig.googleReviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-bold text-white transition-opacity hover:opacity-80"
        >
          <Star className="h-4 w-4 text-brand-neon-cyan" />
          {storeConfig.promoBarMessage}
        </a>
      </div>
    </div>
  );
}
