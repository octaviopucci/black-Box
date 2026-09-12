import { stats } from "@/lib/site-config";

export function ProofStats() {
  return (
    <section className="border-y border-border/50 bg-muted/30 py-12 md:py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-3 gap-6 px-6 md:px-8">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-heading text-4xl text-[var(--brand-accent)] md:text-5xl">
              {stat.value}
            </p>
            <p className="mt-2 text-sm text-muted-foreground md:text-base">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
