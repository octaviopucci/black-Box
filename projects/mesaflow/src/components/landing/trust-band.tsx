import { AUDIENCE_CHIPS } from "@/components/landing/landing-data";

export function TrustBand() {
  return (
    <section aria-label="Público atendido" className="border-y border-[#2a2a2a] bg-[#151515] py-4">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {AUDIENCE_CHIPS.map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-[#333] bg-[#1a1a1a] px-3.5 py-1.5 text-sm font-semibold text-[#ddd]"
          >
            {chip}
          </span>
        ))}
      </div>
    </section>
  );
}
