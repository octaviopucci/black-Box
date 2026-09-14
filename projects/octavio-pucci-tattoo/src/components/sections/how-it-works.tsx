import { steps } from "@/lib/site-config";

export function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-muted/20 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <h2 className="font-heading text-3xl text-foreground uppercase md:text-4xl">
          Como funciona
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Do primeiro contato até a cicatrização — três passos, sem mistério.
        </p>

        <ol className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step) => (
            <li key={step.number}>
              <span className="font-heading text-5xl text-[var(--brand-accent)]/30">
                {step.number}
              </span>
              <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
