import { Suspense } from "react";
import { KdsView } from "@/components/kds/kds-view";

export function generateStaticParams() {
  return [
    { sector: "sec_cozinha" },
    { sector: "sec_balcao" },
    { sector: "sec_bar" },
    { sector: "live" },
  ];
}

export default async function KdsPage({ params }: { params: Promise<{ sector: string }> }) {
  const { sector } = await params;
  return (
    <Suspense fallback={<div className="min-h-dvh bg-[#111] p-4 text-white">Carregando KDS…</div>}>
      <KdsView sectorId={sector} />
    </Suspense>
  );
}
