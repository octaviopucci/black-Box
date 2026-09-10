"use client";

import { useEffect, useState } from "react";
import { fetchLiveProduct } from "@/lib/catalog-api";

interface LiveStockBadgeProps {
  slug: string;
  fallbackStock: boolean;
}

/** Mostra estoque ao vivo na página do produto. */
export function LiveStockBadge({ slug, fallbackStock }: LiveStockBadgeProps) {
  const [qty, setQty] = useState<number | null>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    void fetchLiveProduct(slug).then((p) => {
      if (p) {
        setLive(true);
        setQty(p.stockQuantity ?? (p.stock ? 1 : 0));
      }
    });
  }, [slug]);

  if (!live) {
    return (
      <span className={fallbackStock ? "text-green-500" : "text-red-400"}>
        {fallbackStock ? "Disponível" : "Esgotado"}
      </span>
    );
  }

  if (qty === 0) {
    return <span className="font-bold text-red-400">Esgotado</span>;
  }

  return (
    <span className="font-bold text-green-500">
      {qty} unidade{qty !== 1 ? "s" : ""} disponível{qty !== 1 ? "eis" : ""}
    </span>
  );
}
