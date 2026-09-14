import { KdsView } from "@/components/kds/kds-view";

export function generateStaticParams() {
  return [
    { sector: "sec_cozinha" },
    { sector: "sec_balcao" },
    { sector: "sec_bar" },
  ];
}

export default async function KdsPage({ params }: { params: Promise<{ sector: string }> }) {
  const { sector } = await params;
  return <KdsView sectorId={sector} />;
}
