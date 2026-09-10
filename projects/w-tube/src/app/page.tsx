import { Hero } from "@/components/home/Hero";
import { Benefits } from "@/components/home/Benefits";
import { MaintenanceServices } from "@/components/home/MaintenanceServices";
import { PromoBar } from "@/components/home/PromoBar";
import { LiveHome } from "@/components/catalog/LiveHome";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Benefits />
      <MaintenanceServices />
      <PromoBar />
      <LiveHome />
    </>
  );
}
