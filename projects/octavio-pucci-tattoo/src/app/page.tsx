import { Opening, Manifesto } from "@/components/opening";
import { Works } from "@/components/works";
import { Reserve, Colophon } from "@/components/reserve";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <Opening />
      <main>
        <Manifesto />
        <Works />
        <Reserve />
      </main>
      <Colophon />
    </div>
  );
}
